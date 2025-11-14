import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';

export const getUserProfile = (): Promise<User | null> => {
	const auth = getAuth();

	return new Promise(resolve => {
		onAuthStateChanged(auth, user => {
			resolve(user);
		});
	});
};
