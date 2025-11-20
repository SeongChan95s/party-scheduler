import { Timestamp } from 'firebase/firestore';
import {
	addDocument,
	updateDocument,
	deleteDocument,
	queryCollection,
	where
} from '../firebase/firestore';
import type {
	Availability,
	AvailabilityInput,
	SaveAvailabilityInput,
	TimeSlot,
	OverlapResult,
	TimeSlotDate
} from '@/types/party';

const COLLECTION_NAME = 'availabilities';

/**
 *  가용 시간 저장 (새로 생성 또는 업데이트)
 */
export const saveAvailability = async (input: SaveAvailabilityInput): Promise<string> => {
	const now = Timestamp.now();
	const existing = await getAvailabilityByUserAndParty(input.userId, input.partyId);

	if (existing) {
		await updateDocument(COLLECTION_NAME, existing.id, {
			slots: input.slots,
			updatedAt: now
		});
		return existing.id;
	}

	const availabilityData: AvailabilityInput = {
		partyId: input.partyId,
		userId: input.userId,
		userName: input.userName,
		slots: input.slots,
		createdAt: now,
		updatedAt: now
	};

	return addDocument(COLLECTION_NAME, availabilityData);
};

/**
 *  특정 사용자의 특정 파티 가용 시간 조회
 */
export const getAvailabilityByUserAndParty = async (
	userId: string,
	partyId: string
): Promise<Availability | null> => {
	const results = await queryCollection<Availability>(
		COLLECTION_NAME,
		where('userId', '==', userId),
		where('partyId', '==', partyId)
	);

	return results.length > 0 ? results[0] : null;
};

/**
 * 특정 파티의 가용 가능한 모든 시간 조회
 */
export const getAvailabilitiesByParty = async (
	partyId: string
): Promise<Availability[]> => {
	return queryCollection<Availability>(COLLECTION_NAME, where('partyId', '==', partyId));
};

// 가용 시간 삭제
export const deleteAvailability = async (availabilityId: string): Promise<void> => {
	await deleteDocument(COLLECTION_NAME, availabilityId);
};

// 사용자의 특정 파티 가용 시간 삭제
export const deleteAvailabilityByUserAndParty = async (
	userId: string,
	partyId: string
): Promise<void> => {
	const availability = await getAvailabilityByUserAndParty(userId, partyId);
	if (availability) {
		await deleteDocument(COLLECTION_NAME, availability.id);
	}
};

// TimeSlot을 Date로 변환
export const timeSlotToDate = (slot: TimeSlot): TimeSlotDate => ({
	start: slot.start.toDate(),
	end: slot.end.toDate()
});

// Date를 TimeSlot으로 변환
export const dateToTimeSlot = (slot: TimeSlotDate): TimeSlot => ({
	start: Timestamp.fromDate(slot.start),
	end: Timestamp.fromDate(slot.end)
});

/**
 *   여러 가용 시간에서 겹치는 시간대 계산
 */
export const calculateOverlappingSlots = (
	availabilities: Availability[],
	minOverlapCount: number = 2
): OverlapResult[] => {
	if (availabilities.length < minOverlapCount) {
		return [];
	}

	const allSlots: Array<{
		slot: TimeSlotDate;
		userId: string;
		userName: string;
	}> = [];

	availabilities.forEach(el => {
		el.slots.forEach(slot => {
			allSlots.push({
				slot: timeSlotToDate(slot),
				userId: el.userId,
				userName: el.userName
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
export const getFullOverlapSlots = (availabilities: Availability[]): OverlapResult[] => {
	return calculateOverlappingSlots(availabilities, availabilities.length);
};
