import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { HTTPError } from '../../utils/HTTPError';
import { handleFirebaseAuthErrorMessage } from '@/utils/auth';

export const loginWithEmail = async (email: string, password: string) => {
	try {
		const auth = getAuth();
		await signInWithEmailAndPassword(auth, email, password);

		return {
			success: true,
			message: '로그인에 성공했습니다.'
		};
	} catch (error) {
		if (error instanceof FirebaseError) {
			return { success: false, message: handleFirebaseAuthErrorMessage(error) };
		}

		if (error instanceof Error) {
			console.error(error);
			throw new HTTPError(`${error.name} ${error.message}`);
		}

		throw new HTTPError('알 수 없는 오류가 발생했습니다.', 400);
	}
};
