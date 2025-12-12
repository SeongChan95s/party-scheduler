import {
	collection,
	getDocs,
	addDoc,
	doc,
	getDoc,
	setDoc,
	updateDoc,
	deleteDoc,
	query,
	where,
	orderBy,
	limit,
	QueryConstraint
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

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
export const addDocument = async <
	T extends Record<string, unknown> = Record<string, unknown>
>(
	collectionName: string,
	data: T
) => {
	const docRef = await addDoc(collection(db, collectionName), data);
	return docRef.id;
};

/**
 * 문서 업데이트
 */
export const updateDocument = async (
	collectionName: string,
	docId: string,
	data: Partial<unknown>
) => {
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

/**
 * 서브컬렉션의 모든 문서 가져오기
 * subCollectionName은 'plans/planId/timeSlots' 같은 중첩 경로도 지원
 */
export const getSubCollection = async <T = unknown>(
	parentCollection: string,
	parentDocId: string,
	subCollectionName: string
) => {
	const pathSegments = subCollectionName.split('/').filter(Boolean);
	const subColRef = collection(db, parentCollection, parentDocId, ...pathSegments);
	const snapshot = await getDocs(subColRef);
	return snapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	})) as Array<T & { id: string }>;
};

/**
 * 서브컬렉션 쿼리 조건으로 문서 가져오기
 * subCollectionName은 'plans/planId/timeSlots' 같은 중첩 경로도 지원
 */
export const querySubCollection = async <T = unknown>(
	parentCollection: string,
	parentDocId: string,
	subCollectionName: string,
	...constraints: QueryConstraint[]
) => {
	const pathSegments = subCollectionName.split('/').filter(Boolean);
	const subColRef = collection(db, parentCollection, parentDocId, ...pathSegments);
	const q = query(subColRef, ...constraints);
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	})) as Array<T & { id: string }>;
};

/**
 * 서브컬렉션의 단일 문서 가져오기
 * subCollectionName은 'plans/planId/timeSlots' 같은 중첩 경로도 지원
 */
export const getSubDocument = async <T = unknown>(
	parentCollection: string,
	parentDocId: string,
	subCollectionName: string,
	docId: string
) => {
	const pathSegments = subCollectionName.split('/').filter(Boolean);
	const docRef = doc(db, parentCollection, parentDocId, ...pathSegments, docId);
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
 * 서브컬렉션에 문서 추가 (자동 ID)
 * subCollectionName은 'plans/planId/timeSlots' 같은 중첩 경로도 지원
 */
export const addSubDocument = async <
	T extends Record<string, unknown> = Record<string, unknown>
>(
	parentCollection: string,
	parentDocId: string,
	subCollectionName: string,
	data: T
) => {
	const pathSegments = subCollectionName.split('/').filter(Boolean);
	const subColRef = collection(db, parentCollection, parentDocId, ...pathSegments);
	const docRef = await addDoc(subColRef, data);
	return docRef.id;
};

/**
 * 서브컬렉션에 문서 설정 (지정된 ID 사용)
 * subCollectionName은 'plans/planId/timeSlots' 같은 중첩 경로도 지원
 */
export const setSubDocument = async <
	T extends Record<string, unknown> = Record<string, unknown>
>(
	parentCollection: string,
	parentDocId: string,
	subCollectionName: string,
	docId: string,
	data: T
) => {
	const pathSegments = subCollectionName.split('/').filter(Boolean);
	const docRef = doc(db, parentCollection, parentDocId, ...pathSegments, docId);
	await setDoc(docRef, data);
};

/**
 * 서브컬렉션 문서 업데이트
 * subCollectionName은 'plans/planId/timeSlots' 같은 중첩 경로도 지원
 */
export const updateSubDocument = async (
	parentCollection: string,
	parentDocId: string,
	subCollectionName: string,
	docId: string,
	data: Partial<unknown>
) => {
	const pathSegments = subCollectionName.split('/').filter(Boolean);
	const docRef = doc(db, parentCollection, parentDocId, ...pathSegments, docId);
	await updateDoc(docRef, data);
};

/**
 * 서브컬렉션 문서 삭제
 * subCollectionName은 'plans/planId/timeSlots' 같은 중첩 경로도 지원
 */
export const deleteSubDocument = async (
	parentCollection: string,
	parentDocId: string,
	subCollectionName: string,
	docId: string
) => {
	const pathSegments = subCollectionName.split('/').filter(Boolean);
	const docRef = doc(db, parentCollection, parentDocId, ...pathSegments, docId);
	await deleteDoc(docRef);
};
