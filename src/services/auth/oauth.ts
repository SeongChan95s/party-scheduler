import { db } from '@/lib/firebase/config';
import { getAdditionalUserInfo, type UserCredential } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { useNavigate } from 'react-router-dom';

export const loginWithKakao = async (): Promise<void> => {
	location.href = import.meta.env.VITE_KAKAO_AUTH_URL;
};

export const loginWithNaver = async (): Promise<void> => {
	location.href = import.meta.env.VITE_NAVER_AUTH_URL;
};

export const addProfileInfo = async (
	credential: UserCredential,
	navigate: ReturnType<typeof useNavigate>
) => {
	const { isNewUser } = getAdditionalUserInfo(credential) || {};
	const user = credential.user;
	const userSnapshot = await getDoc(doc(db, 'users', user.uid));

	if (isNewUser || !userSnapshot.exists()) {
		navigate('/auth/profile-complete', {
			state: {
				...user
			},
			replace: true
		});
	} else {
		const callbackURL = localStorage.getItem('callbackURL') ?? '/';
		navigate(callbackURL, { replace: true });
	}
};
