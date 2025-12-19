import axios from 'axios';
import { IconAlertFilled } from '@/components/common/Icon';
import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';
import { handleFirebaseAuthErrorMessage } from '@/utils/auth';
import { FirebaseError } from 'firebase/app';
import { getAuth, signInWithCustomToken, updateProfile } from 'firebase/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setRegisteredUserDataToDB } from '@/services/auth';

export default function NaverRedirectPage() {
	const navigate = useNavigate();
	const code = new URL(document.URL).searchParams.get('code');

	async function signInNaverAuth() {
		if (!code) return;

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_SERVER_URL}/api/auth/naver`,
				{
					code,
					clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
					clientSecret: import.meta.env.VITE_NAVER_CLIENT_SECRET,
					redirectUri: import.meta.env.VITE_NAVER_REDIRECT_URI
				}
			);

			const { customToken, user: userData } = response.data;

			const authResult = await signInWithCustomToken(getAuth(), customToken);
			const user = authResult.user;

			if (userData) {
				await updateProfile(user, {
					displayName: userData.nickname || user.displayName || 'NaverUser',
					photoURL: userData.profile_image || user.photoURL
				});
			}

			await setRegisteredUserDataToDB(authResult.user, 'naver');

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
				console.error('네이버 로그인 오류:', error);
				useGlobalToastStore.getState().push({
					icon: <IconAlertFilled />,
					message: '알수없는 이유로 네이버 로그인에 실패했습니다.'
				});
				return;
			}
		}
	}

	useEffect(() => {
		signInNaverAuth();
	}, []);

	return <div>로그인중입니다.</div>;
}
