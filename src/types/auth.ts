export interface LoginInput {
	email: string;
	password: string;
}

export interface AuthProfile extends LoginInput {
	displayName: string;
	photoURL?: string;
}

export interface UserCollection {
	userId: string;
	birth: string;
	phone: string;
	role: 'admin' | 'member';
}

export type RegisterJoinInput = Omit<AuthProfile, 'photoURL'> &
	Omit<UserCollection, 'userId' | 'role'>;
