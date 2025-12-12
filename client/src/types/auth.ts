import type { ImagePickerMetadata } from '@/components/common/ImagePicker/ImagePicker';
import type { Timestamp } from 'firebase/firestore';

export interface LoginInput {
	email: string;
	password: string;
}

export interface FirebaseAuthProfile extends LoginInput {
	displayName: string;
	phoneNumber: string;
	photoURL: string | null;
}

export type CredentialProvider = 'kakao' | 'naver' | 'google' | 'x' | 'email';

export interface UserNotificationSet {
	all: Boolean;
	invited: Boolean;
	party: Boolean;
	board: Boolean;
	comment: Boolean;
	service: Boolean;
}

export interface RequiredUserDB {
	uid: string;
	displayName: string;
	tag: string;
	photoURL: string | null;
	role: 'admin' | 'member';
	provider: CredentialProvider;
	notification?: UserNotificationSet;
	updatedAt: Timestamp;
	lastLoginAt: Timestamp;
	createdAt: Timestamp;
}

export interface EmailCredentialUser extends RequiredUserDB {
	email: string;
	displayName: string;
	photoURL: string | null;
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

export type RegisteProfileSchema = {
	email: string;
	displayName: string;
	photoFiles?: File[];
	photoMetadata?: ImagePickerMetadata[];
	birth: string;
	tel: string;
};

export type SocialProvider = 'kakao' | 'naver';

export interface SocialLoginInput {
	provider: SocialProvider;
	accessToken: string;
}

export interface SocialUserInfo {
	id: string;
	email?: string;
	displayName?: string;
	photoURL?: string;
	provider: SocialProvider;
}
