import { Timestamp } from 'firebase/firestore';
import {
	addDocument,
	getDocument,
	updateDocument,
	deleteDocument,
	queryCollection,
	where
} from '../firebase/firestore';
import type {
	Party,
	PartyInput,
	CreatePartyInput,
	PartyStatus,
	TimeSlot
} from '@/types/party';

const COLLECTION_NAME = 'parties';

// 파티 생성
export const createParty = async (
	input: CreatePartyInput
): Promise<string> => {
	const now = Timestamp.now();

	const partyData: PartyInput = {
		title: input.title,
		description: input.description,
		creatorId: input.creatorId,
		participantIds: [input.creatorId], // 생성자를 첫 참가자로 추가
		status: 'active',
		createdAt: now,
		updatedAt: now
	};

	return addDocument(COLLECTION_NAME, partyData);
};

// 파티 조회
export const getParty = async (partyId: string): Promise<Party | null> => {
	return getDocument<Party>(COLLECTION_NAME, partyId);
};

// 사용자가 참여 중인 파티 목록 조회
export const getPartiesByUser = async (userId: string): Promise<Party[]> => {
	return queryCollection<Party>(
		COLLECTION_NAME,
		where('participantIds', 'array-contains', userId)
	);
};

// 사용자가 생성한 파티 목록 조회
export const getPartiesCreatedByUser = async (
	userId: string
): Promise<Party[]> => {
	return queryCollection<Party>(
		COLLECTION_NAME,
		where('creatorId', '==', userId)
	);
};

// 파티 참가자 추가
export const addParticipant = async (
	partyId: string,
	userId: string
): Promise<void> => {
	const party = await getParty(partyId);
	if (!party) {
		throw new Error('파티를 찾을 수 없습니다.');
	}

	if (party.participantIds.includes(userId)) {
		throw new Error('이미 참가 중인 파티입니다.');
	}

	await updateDocument(COLLECTION_NAME, partyId, {
		participantIds: [...party.participantIds, userId],
		updatedAt: Timestamp.now()
	});
};

// 파티 참가자 제거
export const removeParticipant = async (
	partyId: string,
	userId: string
): Promise<void> => {
	const party = await getParty(partyId);
	if (!party) {
		throw new Error('파티를 찾을 수 없습니다.');
	}

	if (party.creatorId === userId) {
		throw new Error('파티 생성자는 참가자에서 제거할 수 없습니다.');
	}

	await updateDocument(COLLECTION_NAME, partyId, {
		participantIds: party.participantIds.filter((id: string) => id !== userId),
		updatedAt: Timestamp.now()
	});
};

// 파티 상태 변경
export const updatePartyStatus = async (
	partyId: string,
	status: PartyStatus
): Promise<void> => {
	await updateDocument(COLLECTION_NAME, partyId, {
		status,
		updatedAt: Timestamp.now()
	});
};

// 파티 확정 시간 설정
export const confirmPartySlot = async (
	partyId: string,
	slot: TimeSlot
): Promise<void> => {
	await updateDocument(COLLECTION_NAME, partyId, {
		status: 'confirmed' as PartyStatus,
		confirmedSlot: slot,
		updatedAt: Timestamp.now()
	});
};

// 파티 정보 수정
export const updateParty = async (
	partyId: string,
	data: Partial<Pick<Party, 'title' | 'description'>>
): Promise<void> => {
	await updateDocument(COLLECTION_NAME, partyId, {
		...data,
		updatedAt: Timestamp.now()
	});
};

// 파티 삭제
export const deleteParty = async (partyId: string): Promise<void> => {
	await deleteDocument(COLLECTION_NAME, partyId);
};
