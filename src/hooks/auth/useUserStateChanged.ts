import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect } from 'react';
import { create } from 'zustand';

interface UseUserState {
	user: User | null;
	setUser: (value: User | null) => void;
}

export const useUserState = create<UseUserState>(set => ({
	user: null,
	setUser: value => set({ user: value })
}));

export const useUserStateChanged = () => {
	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, user => {
			if (user) {
				useUserState.getState().setUser(user);
			} else {
				useUserState.getState().setUser(null);
			}
		});

		return () => unsubscribe();
	}, []);
};
