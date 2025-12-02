import { Timestamp } from 'firebase/firestore';
import {
	getSubCollection,
	getSubDocument,
	addSubDocument,
	updateSubDocument,
	deleteSubDocument
} from '../firebase/firestore';
import type { PlansCollection, PlansInput, CreatePlansInput } from '@/types/party';

const PARENT_COLLECTION = 'parties';
const SUB_COLLECTION_NAME = 'plans';

/**
 * Plan 생성
 */
export const createPlan = async (
	partyId: string,
	input: CreatePlansInput
): Promise<string> => {
	const now = Timestamp.now();

	const planData: PlansInput = {
		title: input.title,
		body: input.body,
		category: input.category,
		status: input.status,
		participantIds: [],
		creatorId: input.creatorId,
		createdAt: now,
		updatedAt: now
	};

	return addSubDocument(PARENT_COLLECTION, partyId, SUB_COLLECTION_NAME, planData);
};

/**
 * Plan 조회
 */
export const getPlan = async (
	partyId: string,
	planId: string
): Promise<PlansCollection | null> => {
	return getSubDocument<PlansCollection>(
		PARENT_COLLECTION,
		partyId,
		SUB_COLLECTION_NAME,
		planId
	);
};

/**
 * Party의 모든 Plans 조회
 */
export const getPlansByParty = async (partyId: string): Promise<PlansCollection[]> => {
	return getSubCollection<PlansCollection>(PARENT_COLLECTION, partyId, SUB_COLLECTION_NAME);
};

/**
 * Plan 정보 수정
 */
export const updatePlan = async (
	partyId: string,
	planId: string,
	data: Partial<PlansInput>
): Promise<void> => {
	await updateSubDocument(PARENT_COLLECTION, partyId, SUB_COLLECTION_NAME, planId, {
		...data,
		updatedAt: Timestamp.now()
	});
};

/**
 * Plan 삭제
 */
export const deletePlan = async (partyId: string, planId: string): Promise<void> => {
	await deleteSubDocument(PARENT_COLLECTION, partyId, SUB_COLLECTION_NAME, planId);
};

/**
 * Plan에 참가자 추가
 */
export const addPlanParticipant = async (
	partyId: string,
	planId: string,
	userId: string
): Promise<void> => {
	const plan = await getPlan(partyId, planId);
	if (!plan) {
		throw new Error('Plan을 찾을 수 없습니다.');
	}

	if (plan.participantIds.includes(userId)) {
		throw new Error('이미 참가 중인 Plan입니다.');
	}

	await updateSubDocument(PARENT_COLLECTION, partyId, SUB_COLLECTION_NAME, planId, {
		participantIds: [...plan.participantIds, userId],
		updatedAt: Timestamp.now()
	});
};

/**
 * Plan에서 참가자 제거
 */
export const removePlanParticipant = async (
	partyId: string,
	planId: string,
	userId: string
): Promise<void> => {
	const plan = await getPlan(partyId, planId);
	if (!plan) {
		throw new Error('Plan을 찾을 수 없습니다.');
	}

	await updateSubDocument(PARENT_COLLECTION, partyId, SUB_COLLECTION_NAME, planId, {
		participantIds: plan.participantIds.filter((id: string) => id !== userId),
		updatedAt: Timestamp.now()
	});
};

/**
 * Plan 확정 일정 설정
 */
export const confirmPlanSchedule = async (
	partyId: string,
	planId: string,
	schedule: { start: Timestamp; end: Timestamp }
): Promise<void> => {
	await updateSubDocument(PARENT_COLLECTION, partyId, SUB_COLLECTION_NAME, planId, {
		status: 'ready' as const,
		schedule,
		updatedAt: Timestamp.now()
	});
};
