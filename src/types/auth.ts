import type { Timestamp } from 'firebase/firestore';

export interface LoginInput {
	email: string;
	password: string;
}

export interface FirebaseAuthProfile extends LoginInput {
	displayName: string;
	photoURL?: string;
}

export interface UserCollection {
	email: string;
	displayName: string;
	photoURL?: string;
	birth: Timestamp;
	tel: string;
	friendIds?: string[];
	role: 'admin' | 'member';
	createdAt: Timestamp;
	updatedAt: Timestamp;
	lastLoginAt?: Timestamp;
}

export type RegisterInput = {
	email: string;
	password: string;
	displayName: string;
	photoURL?: string;
	birth: string;
	tel: string;
};
