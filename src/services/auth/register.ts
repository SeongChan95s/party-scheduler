import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { HTTPError } from '../../utils/HTTPError';
import type { RegisterInput } from '../../types/auth';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	query,
	setDoc,
	Timestamp,
	where
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

/**
 * 회원가입 정보입력 API
 */
export const registerAuth = async ({
	email,
	password,
	displayName,
	birth,
	tel
}: RegisterInput) => {
	try {
		const querySnapshot = await getDocs(
			query(collection(db, 'users'), where('email', '==', email), limit(1))
		);
		const results = querySnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		}));

		if (results.length >= 1)
			return { success: false, message: '이메일과 동일한 계정이 존재합니다.' };

		const auth = getAuth();
		const result = await createUserWithEmailAndPassword(auth, email, password);
		await updateProfile(result.user, {
			displayName
		});
		await setDoc(doc(db, 'users', result.user.uid), {
			email,
			displayName,
			birth: Timestamp.fromDate(new Date(birth)),
			tel,
			role: 'member',
			createdAt: Timestamp.fromDate(new Date()),
			updatedAt: Timestamp.fromDate(new Date())
		});

		return {
			success: true,
			message: '회원가입에 성공했습니다.'
		};
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			throw new HTTPError(`${error.name} ${error.message}`);
		}
	}
};
