import {setGlobalOptions} from "firebase-functions";
import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Firebase Admin 초기화
admin.initializeApp();

setGlobalOptions({maxInstances: 10});

/**
 * userId 배열을 받아서 각 사용자의 displayName을 반환하는 함수
 */
export const getUserDisplayNames = onCall(async (request) => {
  try {
    const {userIds} = request.data;

    // 입력 검증
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new Error("userIds must be a non-empty array");
    }

    if (userIds.length > 100) {
      throw new Error("Maximum 100 userIds allowed per request");
    }

    // 각 userId에 대해 displayName 조회
    const userInfoPromises = userIds.map(async (userId: string) => {
      try {
        const userRecord = await admin.auth().getUser(userId);
        return {
          userId,
          displayName: userRecord.displayName || "익명",
        };
      } catch (error) {
        logger.warn(`Failed to fetch user ${userId}:`, error);
        return {
          userId,
          displayName: "익명",
        };
      }
    });

    const userInfos = await Promise.all(userInfoPromises);

    // Map 형태로 반환 (userId -> displayName)
    const result: Record<string, string> = {};
    userInfos.forEach((info) => {
      result[info.userId] = info.displayName;
    });

    return result;
  } catch (error) {
    logger.error("Error in getUserDisplayNames:", error);
    throw error;
  }
});
