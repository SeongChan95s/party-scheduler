import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit, QueryConstraint } from 'firebase/firestore';
import { db } from './config';

/**
 * 컬렉션의 모든 문서 가져오기
 */
export const getCollection = async <T = unknown>(collectionName: string) => {
	const snapshot = await getDocs(collection(db, collectionName));
	return snapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	})) as Array<T & { id: string }>;
};

/**
 * 쿼리 조건으로 문서 가져오기
 */
export const queryCollection = async <T = unknown>(
	collectionName: string,
	...constraints: QueryConstraint[]
) => {
	const q = query(collection(db, collectionName), ...constraints);
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	})) as Array<T & { id: string }>;
};

/**
 * 단일 문서 가져오기
 */
export const getDocument = async <T = unknown>(collectionName: string, docId: string) => {
	const docRef = doc(db, collectionName, docId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return {
			id: docSnap.id,
			...docSnap.data()
		} as T & { id: string };
	}
	return null;
};

/**
 * 문서 추가
 */
export const addDocument = async <T extends Record<string, unknown> = Record<string, unknown>>(collectionName: string, data: T) => {
	const docRef = await addDoc(collection(db, collectionName), data);
	return docRef.id;
};

/**
 * 문서 업데이트
 */
export const updateDocument = async (collectionName: string, docId: string, data: Partial<unknown>) => {
	const docRef = doc(db, collectionName, docId);
	await updateDoc(docRef, data);
};

/**
 * 문서 삭제
 */
export const deleteDocument = async (collectionName: string, docId: string) => {
	const docRef = doc(db, collectionName, docId);
	await deleteDoc(docRef);
};

// 재사용 가능한 쿼리 조건들
export { where, orderBy, limit };
