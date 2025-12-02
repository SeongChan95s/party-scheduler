import { Timestamp } from 'firebase/firestore';
import {
	getSubCollection,
	getSubDocument,
	setSubDocument,
	deleteSubDocument
} from '../firebase/firestore';
import type {
	TimeSlotsCollection,
	SaveTimeSlotsInput,
	TimeSlotsWithUserName,
	TimeSlotStamp,
	TimeSlotDate,
	OverlapResult
} from '@/types/party';

const PARENT_COLLECTION = 'parties';
const PLANS_SUB_COLLECTION = 'plans';
const TIMESLOTS_SUB_COLLECTION = 'timeSlots';

/**
 * TimeSlots 저장 (userId를 문서 ID로 사용)
 */
export const saveTimeSlots = async (input: SaveTimeSlotsInput): Promise<void> => {
	const now = Timestamp.now();

	const timeSlotsData = {
		slots: input.slots,
		createdAt: now,
		updatedAt: now
	};

	// parties/{partyId}/plans/{planId}/timeSlots/{userId}
	await setSubDocument(
		PARENT_COLLECTION,
		input.partyId,
		`${PLANS_SUB_COLLECTION}/${input.planId}/${TIMESLOTS_SUB_COLLECTION}`,
		input.userId,
		timeSlotsData
	);
};

/**
 * 특정 사용자의 TimeSlots 조회
 */
export const getTimeSlotsByUser = async (
	partyId: string,
	planId: string,
	userId: string
): Promise<TimeSlotsCollection | null> => {
	return getSubDocument<TimeSlotsCollection>(
		PARENT_COLLECTION,
		partyId,
		`${PLANS_SUB_COLLECTION}/${planId}/${TIMESLOTS_SUB_COLLECTION}`,
		userId
	);
};

/**
 * Plan의 모든 TimeSlots 조회
 */
export const getTimeSlotsByPlan = async (
	partyId: string,
	planId: string
): Promise<TimeSlotsCollection[]> => {
	return getSubCollection<TimeSlotsCollection>(
		PARENT_COLLECTION,
		partyId,
		`${PLANS_SUB_COLLECTION}/${planId}/${TIMESLOTS_SUB_COLLECTION}`
	);
};

/**
 * TimeSlots 삭제
 */
export const deleteTimeSlots = async (
	partyId: string,
	planId: string,
	userId: string
): Promise<void> => {
	await deleteSubDocument(
		PARENT_COLLECTION,
		partyId,
		`${PLANS_SUB_COLLECTION}/${planId}/${TIMESLOTS_SUB_COLLECTION}`,
		userId
	);
};

/**
 * TimeSlot을 Date로 변환
 */
export const timeSlotToDate = (slot: TimeSlotStamp): TimeSlotDate => ({
	start: slot.start.toDate(),
	end: slot.end.toDate()
});

/**
 * Date를 TimeSlot으로 변환
 */
export const dateToTimeSlot = (slot: TimeSlotDate): TimeSlotStamp => ({
	start: Timestamp.fromDate(slot.start),
	end: Timestamp.fromDate(slot.end)
});

/**
 * 여러 가용 시간에서 겹치는 시간 계산
 * @param `minOverlapCount` 최소 겹치는 횟수
 */
export const calculateOverlappingSlots = (
	timeSlots: TimeSlotsWithUserName[],
	minOverlapCount: number = 2
): OverlapResult[] => {
	if (timeSlots.length < minOverlapCount) {
		return [];
	}

	const allSlots: Array<{
		slot: TimeSlotDate;
		userId: string;
		userName: string;
	}> = [];

	timeSlots.forEach(timeSlot => {
		timeSlot.slots.forEach(slot => {
			allSlots.push({
				slot: timeSlotToDate(slot),
				userId: timeSlot.id,
				userName: timeSlot.userName
			});
		});
	});

	if (allSlots.length === 0) {
		return [];
	}

	// 이벤트 기반 스위핑 알고리즘
	type Event = {
		time: number;
		type: 'start' | 'end';
		userId: string;
		userName: string;
	};

	const events: Event[] = [];

	allSlots.forEach(
		({
			slot,
			userId,
			userName
		}: {
			slot: TimeSlotDate;
			userId: string;
			userName: string;
		}) => {
			events.push({
				time: slot.start.getTime(),
				type: 'start',
				userId,
				userName
			});
			events.push({
				time: slot.end.getTime(),
				type: 'end',
				userId,
				userName
			});
		}
	);

	// 시간 순으로 정렬 (같은 시간이면 end를 먼저)
	events.sort((a, b) => {
		if (a.time !== b.time) {
			return a.time - b.time;
		}
		return a.type === 'end' ? -1 : 1;
	});

	const overlaps: OverlapResult[] = [];
	const activeUsers = new Map<string, string>(); // userId -> userName
	let lastTime: number | null = null;

	events.forEach(event => {
		// 이전 구간에서 겹치는 사용자가 minOverlapCount 이상이면 결과에 추가
		if (
			lastTime !== null &&
			event.time > lastTime &&
			activeUsers.size >= minOverlapCount
		) {
			const userIds = Array.from(activeUsers.keys());
			const userNames = Array.from(activeUsers.values());

			overlaps.push({
				slot: {
					start: Timestamp.fromMillis(lastTime),
					end: Timestamp.fromMillis(event.time)
				},
				count: activeUsers.size,
				userIds,
				userNames
			});
		}

		// 활성 사용자 업데이트
		if (event.type === 'start') {
			activeUsers.set(event.userId, event.userName);
		} else {
			activeUsers.delete(event.userId);
		}

		lastTime = event.time;
	});

	// 연속된 겹치는 구간 병합
	return mergeOverlaps(overlaps);
};

// 연속된 겹치는 구간 병합
const mergeOverlaps = (overlaps: OverlapResult[]): OverlapResult[] => {
	if (overlaps.length === 0) {
		return [];
	}

	const merged: OverlapResult[] = [];
	let current = overlaps[0];

	for (let i = 1; i < overlaps.length; i++) {
		const next = overlaps[i];

		// 같은 사용자 그룹이고 연속된 시간이면 병합
		const currentEnd = current.slot.end.toMillis();
		const nextStart = next.slot.start.toMillis();
		const sameUsers =
			current.userIds.length === next.userIds.length &&
			current.userIds.every((id: string) => next.userIds.includes(id));

		if (currentEnd === nextStart && sameUsers) {
			current = {
				...current,
				slot: {
					start: current.slot.start,
					end: next.slot.end
				}
			};
		} else {
			merged.push(current);
			current = next;
		}
	}

	merged.push(current);
	return merged;
};

// 전원이 가능한 시간대만 필터링
export const getFullOverlapSlots = (
	timeSlots: TimeSlotsWithUserName[]
): OverlapResult[] => {
	return calculateOverlappingSlots(timeSlots, timeSlots.length);
};
