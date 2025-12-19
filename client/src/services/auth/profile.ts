import { updatePassword, updateProfile } from 'firebase/auth';
import type { SetProfileInput } from '../../types/auth';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getFileFormat } from '@/utils/getFileFormat';
import { HTTPError } from '@/utils/HTTPError';
import { useUserState } from '@/hooks/auth/useUserStateChanged';
import { setRegisteredUserDataToDB } from './register';

/**
 * 이메일 회원가입 정보입력
 */
export const setProfile = async ({
	email,
	password,
	displayName,
	photoFile
}: SetProfileInput) => {
	const user = useUserState.getState().user;
	if (!user) throw new HTTPError('로그인이 필요합니다.', 401);

	const querySnapshot = await getDocs(
		query(collection(db, 'users'), where('email', '==', email), limit(1))
	);
	if (querySnapshot.empty) {
		throw new HTTPError('이메일 주소가 존재하지 않습니다.', 404);
	}

	if (password) await updatePassword(user, password);

	let photoURL: string | undefined;

	if (photoFile) {
		const photoFormat = getFileFormat(photoFile.name);
		photoURL = `/auth/profile/${new Date().getTime()}.${photoFormat}`;
		const storage = getStorage();
		const storageRef = ref(storage, photoURL);
		await uploadBytes(storageRef, photoFile);
	}

	await updateProfile(user, {
		displayName,
		...(photoURL && { photoURL })
	});

	await setRegisteredUserDataToDB(user, 'email');
};
