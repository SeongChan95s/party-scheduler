import { db } from '@/lib/firebase/config';
import { requiredUserDBschema } from '@/schemas/auth';
import { HTTPError } from '@/utils/HTTPError';
import { getAdditionalUserInfo, type UserCredential } from 'firebase/auth';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	query,
	setDoc,
	updateDoc,
	where
} from 'firebase/firestore';
import { omit } from 'lodash';

export const loginWithKakao = async (): Promise<void> => {
	location.href = import.meta.env.VITE_KAKAO_AUTH_URL;
};

export const loginWithNaver = async (): Promise<void> => {
	location.href = import.meta.env.VITE_NAVER_AUTH_URL;
};

/**
 * 로그인 및 가입 시, 유저의 필수 데이터를 DB에 저장/업데이트하는 함수
 */
export const setRequiredUserDataToDB = async (
	userCredential: UserCredential,
	provider: string
) => {
	const { isNewUser } = getAdditionalUserInfo(userCredential) || {};
	const userDoc = doc(db, 'users', userCredential.user.uid);
	const userSnapshot = await getDoc(userDoc);

	// 가입 시
	if (isNewUser || !userSnapshot.exists()) {
		let tag = '';
		let isUnique = false;

		while (!isUnique) {
			tag = Math.floor(Math.random() * 10000)
				.toString()
				.padStart(4, '0');
			const q = query(
				collection(db, 'users'),
				where('displayName', '==', userCredential.user.displayName),
				where('tag', '==', tag),
				limit(1)
			);
			const querySnapshot = await getDocs(q);
			if (querySnapshot.empty) {
				isUnique = true;
			}
		}

		const validation = requiredUserDBschema.safeParse({
			...userCredential.user,
			tag,
			provider
		});
		if (validation.error) {
			throw new HTTPError(
				`유효성 검사 실패.: ${validation.error.issues[0].message}`,
				400
			);
		}
		const data = omit(validation.data, 'uid');
		await setDoc(userDoc, data);
	} else {
		// 기존 회원
		const user = { uid: userSnapshot.id, ...userSnapshot.data() };
		const validation = requiredUserDBschema.safeParse({
			...user
		});
		if (validation.error) {
			throw new HTTPError(
				`유효성 검사 실패.: ${validation.error.issues[0].message}`,
				400
			);
		}
		await updateDoc(userDoc, omit(validation.data, 'uid'));
	}
};
