import type { Timestamp } from 'firebase/firestore';

// 시간 슬롯 타입
export interface TimeSlotStamp {
	start: Timestamp;
	end: Timestamp;
}

// 파티 상태
export type PartyStatus = 'active' | 'confirmed' | 'cancelled';

// 파티/약속 타입
export interface Party {
	id: string;
	title: string;
	description?: string;
	creatorId: string;
	participantIds: string[];
	status: PartyStatus;
	availablePeriod: TimeSlotStamp;
	confirmedSlot?: TimeSlotStamp;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

// Firestore에 저장할 때는 id를 제외
export type PartyInput = Omit<Party, 'id'>;

// 파티 생성 시 필요한 최소 입력
export type CreatePartyInput = Pick<
	Party,
	'title' | 'description' | 'creatorId' | 'availablePeriod'
>;

// 가용 시간대 타입 (Firestore에 저장되는 데이터)
export interface Availability {
	id: string;
	partyId: string;
	userId: string;
	slots: TimeSlotStamp[];
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

// Firestore에 저장할 때는 id를 제외
export type AvailabilityInput = Omit<Availability, 'id'>;

// 가용 시간 저장 시 필요한 입력
export type SaveAvailabilityInput = Pick<Availability, 'partyId' | 'userId' | 'slots'>;

// userName이 포함된 Availability (클라이언트 사이드용)
export interface AvailabilityWithUserName extends Availability {
	userName: string;
}

// 캘린더 이벤트 타입 (UI용)
export interface CalendarEvent {
	id: string;
	title: string;
	start: Date;
	end: Date;
	allDay?: boolean;
	userId?: string;
	userName?: string;
	isOverlapping?: boolean;
	isMyEvent?: boolean;
	overlapCount?: number;
}

// 겹치는 시간대 계산 결과
export interface OverlapResult {
	slot: TimeSlotStamp;
	count: number;
	userIds: string[];
	userNames: string[];
}

// Date 타입을 사용하는 TimeSlot (클라이언트 사이드용)
export interface TimeSlotDate {
	start: Date;
	end: Date;
}
