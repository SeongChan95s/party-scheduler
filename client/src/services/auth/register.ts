import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
	getAdditionalUserInfo,
	type UserCredential
} from 'firebase/auth';
import type { RegisterEmailCredentialInput } from '../../types/auth';
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
import { db } from '../../lib/firebase/config';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getFileFormat } from '@/utils/getFileFormat';
import { HTTPError } from '@/utils/HTTPError';
import { requiredUserDBschema } from '@/schemas/auth';
import { omit } from 'lodash';

/**
 * 회원가입 정보입력 API
 */
export const registerAuth = async ({
	email,
	password,
	displayName,
	photoFiles
}: RegisterEmailCredentialInput) => {
	try {
		const querySnapshot = await getDocs(
			query(collection(db, 'users'), where('email', '==', email), limit(1))
		);
		const results = querySnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		}));

		if (results.length >= 1)
			return { success: false, message: '이메일과 동일한 계정이 존재합니다.' };

		const auth = getAuth();
		const result = await createUserWithEmailAndPassword(auth, email, password);

		const photoFile = photoFiles?.[0];
		let photoURL: string | undefined;

		if (photoFile) {
			const photoFormat = getFileFormat(photoFile.name);
			photoURL = `/auth/profile/${new Date().getTime()}.${photoFormat}`;
			const storage = getStorage();
			const storageRef = ref(storage, photoURL);
			await uploadBytes(storageRef, photoFile);
		}

		await updateProfile(result.user, {
			displayName,
			...(photoURL && { photoURL })
		});

		await setRegisteredUserDataToDB(result, 'email');

		return {
			success: true,
			message: '회원가입에 성공했습니다.'
		};
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			throw error;
		}
	}
};

/**
 * 로그인 및 가입 시, 유저의 필수 데이터를 DB에 저장/업데이트하는 함수
 */
export const setRegisteredUserDataToDB = async (
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
