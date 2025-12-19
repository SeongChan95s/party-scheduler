import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export const loginWithEmail = async (email: string, password: string) => {
	const auth = getAuth();
	await signInWithEmailAndPassword(auth, email, password);
};
