import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { HTTPError } from '../../utils/HTTPError';
import type { RegisterInput, UsersCollection } from '../../types/auth';
import {
	collection,
	doc,
	getDocs,
	limit,
	query,
	setDoc,
	Timestamp,
	where
} from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getFileFormat } from '@/utils/getFileFormat';

/**
 * 회원가입 정보입력 API
 */
export const registerAuth = async ({
	email,
	password,
	displayName,
	photoFiles,
	photoMetadata,
	birth,
	tel
}: RegisterInput) => {
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
			photoURL = `/auth/${new Date().getTime()}.${photoFormat}`;
			const storage = getStorage();
			const storageRef = ref(storage, photoURL);
			await uploadBytes(storageRef, photoFile);
		}

		await updateProfile(result.user, {
			displayName,
			...(photoURL && { photoURL })
		});

		const now = Timestamp.fromDate(new Date());
		const userData: UsersCollection = {
			email,
			displayName,
			birth: Timestamp.fromDate(new Date(birth)),
			tel,
			role: 'member',
			createdAt: now,
			updatedAt: now,
			lastLoginAt: now
		};

		console.log(userData);

		await setDoc(doc(db, 'users', result.user.uid), userData);

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
