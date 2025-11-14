import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { HTTPError } from '../../utils/HTTPError';
import type { RegisterJoinInput } from '../../types/auth';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';

/**
 * 회원가입 정보입력
 */
export const registerAuth = async ({
	email,
	password,
	displayName,
	birth,
	phone
}: RegisterJoinInput) => {
	try {
		const auth = getAuth();
		const result = await createUserWithEmailAndPassword(auth, email, password);
		await updateProfile(result.user, {
			displayName
		});
		await addDoc(collection(db, 'user'), {
			userId: result.user.uid,
			birth,
			phone,
			role: 'member'
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
