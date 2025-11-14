import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { HTTPError } from '../../utils/HTTPError';

export const loginAuth = async (email: string, password: string) => {
	try {
		const auth = getAuth();
		await signInWithEmailAndPassword(auth, email, password);
	} catch (error) {
		if (error instanceof FirebaseError) {
			switch (error.code) {
				case 'auth/user-not-found':
					return { success: false, message: '등록되지 않은 이메일입니다.' };
				case 'auth/wrong-password':
					return { success: false, message: '비밀번호가 일치하지 않습니다.' };
				case 'auth/invalid-email':
					return { success: false, message: '올바르지 않은 이메일 형식입니다.' };
				case 'auth/user-disabled':
					return { success: false, message: '비활성화된 계정입니다.' };
				case 'auth/too-many-requests':
					return {
						success: false,
						message: '로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.'
					};
				case 'auth/invalid-credential':
					return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
				default:
					return { success: false, message: '로그인 중 오류가 발생했습니다.' };
			}
		}

		if (error instanceof Error) {
			console.error(error);
			throw new HTTPError(`${error.name} ${error.message}`);
		}

		throw new HTTPError('알 수 없는 오류가 발생했습니다.');
	}
};
