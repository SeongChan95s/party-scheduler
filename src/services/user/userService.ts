import { getFunctions, httpsCallable } from 'firebase/functions';

/**
 * Firebase Functions를 통해 여러 userId의 displayName을 조회
 */
export const getUserDisplayNames = async (
	userIds: string[]
): Promise<Record<string, string>> => {
	const functions = getFunctions();
	const callable = httpsCallable<{ userIds: string[] }, Record<string, string>>(
		functions,
		'getUserDisplayNames'
	);

	const result = await callable({ userIds });
	return result.data;
};
