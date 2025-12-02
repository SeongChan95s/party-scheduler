import type { ImagePickerMetadata } from '@/components/common/ImagePicker/ImagePicker';
import type { Timestamp } from 'firebase/firestore';

export interface LoginInput {
	email: string;
	password: string;
}

export interface FirebaseAuthProfile extends LoginInput {
	displayName: string;
	phoneNumber: string;
	photoURL?: string;
}

export interface UsersCollection {
	id: string;
	email: string;
	displayName: string;
	photoURL?: string;
	birth: Timestamp;
	tel: string;
	role: 'admin' | 'member';
	notification?: {
		all: Boolean;
		message: Boolean;
		response: Boolean;
		invite: Boolean;
		party: Boolean;
		board: Boolean;
		vote: Boolean;
		comment: Boolean;
		service: Boolean;
	};
	createdAt: Timestamp;
	updatedAt: Timestamp;
	lastLoginAt: Timestamp;
}

export interface FriendsCollection {
	id: string;
	status: 'special' | 'friend' | 'request';
}

export type RegisterInput = {
	email: string;
	password: string;
	displayName: string;
	photoFiles?: File[];
	photoMetadata?: ImagePickerMetadata[];
	birth: string;
	tel: string;
};
