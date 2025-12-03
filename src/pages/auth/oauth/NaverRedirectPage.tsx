import { IconAlertFilled } from '@/components/common/Icon';
import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';
import { handleFirebaseAuthErrorMessage } from '@/utils/auth';
import { FirebaseError } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { functions, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function NaverRedirectPage() {
	const navigate = useNavigate();
	const code = new URL(document.URL).searchParams.get('code');

	async function getNaverAuthToken() {
		if (!code) return;

		try {
			const exchangeToken = httpsCallable(functions, 'exchangeNaverToken');
			const result = await exchangeToken({
				code,
				clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
				clientSecret: import.meta.env.VITE_NAVER_CLIENT_SECRET,
				redirectUri: import.meta.env.VITE_NAVER_REDIRECT_URI
			});

			const data = result.data as {
				customToken: string;
				user: {
					id: string;
					email?: string;
					nickname?: string;
					profile_image?: string;
					mobile: string;
				};
			};

			const authResult = await signInWithCustomToken(getAuth(), data.customToken);
			const user = authResult.user;

			const userDoc = doc(db, 'users', user.uid);
			const userSnapshot = await getDoc(userDoc);

			if (!userSnapshot.exists()) {
				navigate('/auth/profile-complete', {
					state: {
						id: data.user.id,
						email: data.user.email,
						displayName: data.user.nickname,
						photoURL: data.user.profile_image,
						tel: data.user.mobile.replace('-', '')
					},
					replace: true
				});
			} else {
				// 기존 사용자인 경우 홈으로
				const callbackURL = localStorage.getItem('callbackURL') ?? '/';
				navigate(callbackURL, { replace: true });
			}
		} catch (error) {
			console.error('네이버 로그인 오류:', error);
			if (error instanceof FirebaseError) {
				const message = handleFirebaseAuthErrorMessage(error);
				useGlobalToastStore.getState().push({
					icon: <IconAlertFilled />,
					message
				});
			} else {
				useGlobalToastStore.getState().push({
					icon: <IconAlertFilled />,
					message: '네이버 로그인에 실패했습니다.'
				});
			}
		}
	}

	useEffect(() => {
		getNaverAuthToken();
	}, []);

	return <></>;
}
