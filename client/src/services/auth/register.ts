import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
	type User
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
import { HTTPError } from '@/utils/HTTPError';
import { requiredUserDBschema } from '@/schemas/auth';
import { omit } from 'lodash';

/**
 * 이메일 회원가입 정보입력
 */
export const registerAuth = async ({
	email,
	password,
	displayName
}: RegisterEmailCredentialInput) => {
	const querySnapshot = await getDocs(
		query(collection(db, 'users'), where('email', '==', email), limit(1))
	);
	const results = querySnapshot.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	}));
	if (results.length >= 1)
		throw new HTTPError('동일한 이메일을 가진 계정이 존재합니다.', 400);

	const auth = getAuth();
	const result = await createUserWithEmailAndPassword(auth, email, password);

	await updateProfile(result.user, {
		displayName
	});

	await setRegisteredUserDataToDB(result.user, 'email');
};

/**
 * 로그인 및 가입 시, 유저의 필수 데이터를 DB에 저장/업데이트하는 함수
 */
export const setRegisteredUserDataToDB = async (user: User, provider: string) => {
	const userDoc = doc(db, 'users', user.uid);
	const userSnapshot = await getDoc(userDoc);

	// 가입 시
	if (!userSnapshot.exists()) {
		let tag = '';
		let isUnique = false;

		while (!isUnique) {
			tag = Math.floor(Math.random() * 10000)
				.toString()
				.padStart(4, '0');
			const q = query(
				collection(db, 'users'),
				where('displayName', '==', user.displayName),
				where('tag', '==', tag),
				limit(1)
			);
			const querySnapshot = await getDocs(q);
			if (querySnapshot.empty) {
				isUnique = true;
			}
		}

		const data = requiredUserDBschema.parse({
			...user,
			tag,
			provider
		});

		await setDoc(userDoc, omit(data, 'uid'));
	} else {
		// 기존 회원
		const user = { uid: userSnapshot.id, ...userSnapshot.data() };
		const data = requiredUserDBschema.parse({
			...user
		});

		await updateDoc(userDoc, omit(data, 'uid'));
	}
};
