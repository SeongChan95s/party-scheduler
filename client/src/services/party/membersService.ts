import { Timestamp } from 'firebase/firestore';
import {
	getSubCollection,
	getSubDocument,
	setSubDocument,
	updateSubDocument,
	deleteSubDocument
} from '../firebase/firestore';
import type { MembersCollection } from '@/types/party';

const PARENT_COLLECTION = 'parties';
const SUB_COLLECTION_NAME = 'members';

/**
 * Member 추가 (userId를 문서 ID로 사용)
 */
export const addMember = async (
	partyId: string,
	userId: string,
	status: 'invite' | 'waiting-approval',
	inviterId?: string
): Promise<void> => {
	const memberData = {
		status,
		updatedAt: Timestamp.now(),
		...(inviterId && { inviterId })
	};

	await setSubDocument(
		PARENT_COLLECTION,
		partyId,
		SUB_COLLECTION_NAME,
		userId,
		memberData
	);
};

/**
 * Party의 모든 Members 조회
 */
export const getMembersByParty = async (partyId: string): Promise<MembersCollection[]> => {
	return getSubCollection<MembersCollection>(
		PARENT_COLLECTION,
		partyId,
		SUB_COLLECTION_NAME
	);
};

/**
 * 특정 Member 조회
 */
export const getMember = async (
	partyId: string,
	userId: string
): Promise<MembersCollection | null> => {
	return getSubDocument<MembersCollection>(
		PARENT_COLLECTION,
		partyId,
		SUB_COLLECTION_NAME,
		userId
	);
};

/**
 * Member 상태 업데이트
 */
export const updateMemberStatus = async (
	partyId: string,
	userId: string,
	status: 'invite' | 'waiting-approval'
): Promise<void> => {
	await updateSubDocument(PARENT_COLLECTION, partyId, SUB_COLLECTION_NAME, userId, {
		status,
		updatedAt: Timestamp.now()
	});
};

/**
 * Member 제거
 */
export const removeMember = async (partyId: string, userId: string): Promise<void> => {
	await deleteSubDocument(PARENT_COLLECTION, partyId, SUB_COLLECTION_NAME, userId);
};
