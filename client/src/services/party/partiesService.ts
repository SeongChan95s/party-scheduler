import { Timestamp } from 'firebase/firestore';
import { addDocument, getDocument, updateDocument, deleteDocument } from '../firebase/firestore';
import type { PartiesCollection, PartiesInput, CreatePartiesInput } from '@/types/party';

const COLLECTION_NAME = 'parties';

/**
 * 6자리 랜덤 초대 코드 생성
 */
function generateInviteCode(): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	for (let i = 0; i < 6; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

/**
 * Parties 생성
 */
export const createParties = async (input: CreatePartiesInput): Promise<string> => {
	const now = Timestamp.now();

	const partiesData: PartiesInput = {
		title: input.title,
		body: input.body,
		photoURL: '/default-party-image.png',
		inviteCode: generateInviteCode(),
		entries: {
			privacy: false,
			approval: false
		},
		managerIds: input.managerIds,
		creatorId: input.creatorId,
		createdAt: now,
		updatedAt: now,
		notificationCheckedIds: [],
		fixedPostId: ''
	};

	return addDocument(COLLECTION_NAME, partiesData);
};

/**
 * Parties 조회
 */
export const getParties = async (partyId: string): Promise<PartiesCollection | null> => {
	return getDocument<PartiesCollection>(COLLECTION_NAME, partyId);
};

/**
 * Parties 정보 수정
 */
export const updateParties = async (
	partyId: string,
	data: Partial<PartiesInput>
): Promise<void> => {
	await updateDocument(COLLECTION_NAME, partyId, {
		...data,
		updatedAt: Timestamp.now()
	});
};

/**
 * Parties 삭제
 */
export const deleteParties = async (partyId: string): Promise<void> => {
	await deleteDocument(COLLECTION_NAME, partyId);
};
