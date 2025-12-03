import { IconAlertFilled } from '@/components/common/Icon';
import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';
import { addProfileInfo } from '@/services/auth';
import { handleFirebaseAuthErrorMessage } from '@/utils/auth';
import { FirebaseError } from 'firebase/app';
import { getAuth, OAuthProvider, signInWithCredential } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { functions } from '@/lib/firebase/config';

export default function KakaoRedirectPage() {
	const navigate = useNavigate();
	const code = new URL(document.URL).searchParams.get('code');

	async function getKakaoAuthToken() {
		if (!code) return;

		try {
			const exchangeToken = httpsCallable(functions, 'exchangeKakaoToken');
			const result = await exchangeToken({
				code,
				clientId: import.meta.env.VITE_KAKAO_REST_API_KEY,
				clientSecret: import.meta.env.VITE_KAKAO_CLIENT_SECRET,
				redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI
			});

			const tokenData = result.data as { access_token: string; id_token?: string };

			const provider = new OAuthProvider('oidc.kakao');
			const credential = provider.credential({
				idToken: tokenData.id_token
			});

			const authResult = await signInWithCredential(getAuth(), credential);

			await addProfileInfo(authResult, navigate);
		} catch (error) {
			if (error instanceof FirebaseError) {
				const message = handleFirebaseAuthErrorMessage(error);
				useGlobalToastStore.getState().push({
					icon: <IconAlertFilled />,
					message
				});
			} else {
				useGlobalToastStore.getState().push({
					icon: <IconAlertFilled />,
					message: '카카오 로그인에 실패했습니다.'
				});
			}
		}
	}

	useEffect(() => {
		getKakaoAuthToken();
	}, []);

	return <></>;
}
