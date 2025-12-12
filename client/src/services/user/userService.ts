import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';
import { FunctionsError, getFunctions, httpsCallable } from 'firebase/functions';

/**
 * 여러 userIds의 displayName을 조회
 */
export const getUserDisplayNames = async (
	userIds: string[]
): Promise<Record<string, string>> => {
	try {
		const functions = getFunctions();
		const callable = httpsCallable<{ userIds: string[] }, Record<string, string>>(
			functions,
			'getUserDisplayNames'
		);

		const result = await callable({ userIds });
		return result.data;
	} catch (error) {
		if (error instanceof FunctionsError) {
			useGlobalToastStore.getState().push({
				message: error.message
			});
		}

		throw error;
	}
};
