import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';

export const getAsyncUser = () =>
	new Promise<User | null>(resolve => {
		const auth = getAuth();

		const unsubscribe = onAuthStateChanged(auth, user => {
			unsubscribe();
			resolve(user);
		});

		return unsubscribe;
	});
