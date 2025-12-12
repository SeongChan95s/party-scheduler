import axios from 'axios';
import { IconAlertFilled } from '@/components/common/Icon';
import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';
import { handleFirebaseAuthErrorMessage } from '@/utils/auth';
import { FirebaseError } from 'firebase/app';
import { getAuth, OAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setRequiredUserDataToDB } from '@/services/auth';

export default function KakaoRedirectPage() {
	const navigate = useNavigate();
	const code = new URL(document.URL).searchParams.get('code');

	async function signInKakaoAuth() {
		if (!code) return;

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/auth/kakao`,
				{
					code,
					clientId: import.meta.env.VITE_KAKAO_REST_API_KEY,
					clientSecret: import.meta.env.VITE_KAKAO_CLIENT_SECRET,
					redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI
				}
			);

			const { data: tokenData } = response.data;

			const provider = new OAuthProvider('oidc.kakao');
			const credential = provider.credential({
				idToken: tokenData.id_token
			});
			const userCredential = await signInWithCredential(getAuth(), credential);
			await setRequiredUserDataToDB(userCredential, 'kakao');

			const callbackURL = localStorage.getItem('callbackURL') ?? '/';
			navigate(callbackURL, { replace: true });
		} catch (error) {
			if (error instanceof FirebaseError) {
				const message = handleFirebaseAuthErrorMessage(error);
				useGlobalToastStore.getState().push({
					icon: <IconAlertFilled />,
					message
				});
				return;
			}
			if (error instanceof Error) {
				console.error('카카오 로그인 오류:', error);
				useGlobalToastStore.getState().push({
					icon: <IconAlertFilled />,
					message: `알수없는 이유로 카카오 로그인에 실패했습니다:`
				});
				return;
			}
		}
	}

	useEffect(() => {
		signInKakaoAuth();
	}, []);

	return <></>;
}
