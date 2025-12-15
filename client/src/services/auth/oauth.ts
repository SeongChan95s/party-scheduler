import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';
import { handleFirebaseAuthErrorMessage } from '@/utils/auth';
import { FirebaseError } from 'firebase/app';
import {
	GoogleAuthProvider,
	TwitterAuthProvider,
	signInWithPopup,
	getAuth
} from 'firebase/auth';
import { setRegisteredUserDataToDB } from './register';

export const loginWithKakao = async (): Promise<void> => {
	location.replace(import.meta.env.VITE_KAKAO_AUTH_URL);
};

export const loginWithNaver = async (): Promise<void> => {
	location.replace(import.meta.env.VITE_NAVER_AUTH_URL);
};

export const loginWithGoogle = async () => {
	try {
		const provider = new GoogleAuthProvider();
		const auth = getAuth();

		const userCredential = await signInWithPopup(auth, provider);
		await setRegisteredUserDataToDB(userCredential, 'google');
	} catch (error) {
		if (error instanceof FirebaseError) {
			const message = handleFirebaseAuthErrorMessage(error);
			useGlobalToastStore.getState().push({
				message
			});

			const callbackURL = localStorage.getItem('callbackURL') ?? '/';
			location.replace(callbackURL);
		} else {
			console.error('구글 로그인 오류:', error);
			useGlobalToastStore.getState().push({
				message: `알수없는 이유로 구글 로그인에 실패했습니다.`
			});
		}
	}
};

export const loginWithTwitter = async () => {
	try {
		const provider = new TwitterAuthProvider();
		const auth = getAuth();

		const userCredential = await signInWithPopup(auth, provider);
		await setRegisteredUserDataToDB(userCredential, 'twitter');
	} catch (error) {
		if (error instanceof FirebaseError) {
			const message = handleFirebaseAuthErrorMessage(error);
			useGlobalToastStore.getState().push({
				message
			});
		} else {
			console.error('트위터 로그인 오류:', error);
			useGlobalToastStore.getState().push({
				message: `알수없는 이유로 트위터 로그인에 실패했습니다.`
			});
		}

		const callbackURL = localStorage.getItem('callbackURL') ?? '/';
		location.replace(callbackURL);
	}
};
