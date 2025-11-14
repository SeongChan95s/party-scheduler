import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';

export const checkAuth = (): Promise<User | null> => {
	const auth = getAuth();

	return new Promise((resolve) => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			unsubscribe(); // 한 번만 체크하고 구독 해제
			resolve(user);
		});
	});
};
