import { setGlobalOptions } from 'firebase-functions';
import { onCall } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';

// Firebase Admin 초기화
admin.initializeApp();

setGlobalOptions({ maxInstances: 10 });

/**
 * userId 배열을 받아서 각 사용자의 displayName을 반환하는 함수
 */
export const getUserDisplayNames = onCall(async request => {
	try {
		const { userIds } = request.data;

		if (!Array.isArray(userIds) || userIds.length === 0) {
			throw new Error('userIds는 비어 있지 않은 배열이어야 합니다.');
		}

		if (userIds.length > 40) {
			throw new Error('최대 40개의 userId가 허용됩니다.');
		}

		const userInfoPromises = userIds.map(async (userId: string) => {
			try {
				const userRecord = await admin.auth().getUser(userId);
				return {
					userId,
					displayName: userRecord.displayName || '익명'
				};
			} catch (error) {
				logger.warn(`유저 정보를 가져오는데 실패했습니다. ${userId}:`, error);
				return {
					userId,
					displayName: '익명'
				};
			}
		});

		const userInfos = await Promise.all(userInfoPromises);

		const result: Record<string, string> = {};
		userInfos.forEach(info => {
			result[info.userId] = info.displayName;
		});

		return result;
	} catch (error) {
		logger.error('에러가 발생했습니다. getUserDisplayNames:', error);
		throw error;
	}
});
