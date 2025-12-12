import type { GeoPoint, Timestamp } from 'firebase/firestore';

// 시간 슬롯 타입
export interface TimeSlotStamp {
	start: Timestamp;
	end: Timestamp;
}

// 파티 상태
export type PartyStatus = 'active' | 'confirmed' | 'cancelled';

/**
 * @deprecated 새 코드에서는 PartiesCollection + PlansCollection 사용
 */
export interface Party {
	id: string;
	name: string;
	description?: string;
	creatorId: string;
	memberIds: string[];
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
	'name' | 'description' | 'creatorId' | 'availablePeriod'
>;

/**
 * @deprecated 새 코드에서는 TimeSlotsCollection 사용
 */
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

// ============================================
// 새로운 구조 (Parties > Plans > TimeSlots)
// ============================================

// Parties 컬렉션 (최상위)
export interface PartiesCollection {
	id: string;
	title: string;
	body: string;
	photoURL: string;
	inviteCode: string;
	entries: {
		privacy: boolean;
		approval: boolean;
		password?: string;
	};
	managerIds: string;
	creatorId: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	notificationCheckedIds: string[];
	fixedPostId: string;
}

// Firestore에 저장할 때는 id를 제외
export type PartiesInput = Omit<PartiesCollection, 'id'>;

// Parties 생성 시 필요한 입력
export type CreatePartiesInput = Pick<
	PartiesCollection,
	'title' | 'body' | 'managerIds' | 'creatorId'
>;

// Plans 서브컬렉션
export interface PlansCollection {
	id: string;
	title: string;
	body: string;
	category: string;
	schedule?: { start: Timestamp; end: Timestamp };
	availability?: { start: Timestamp; end: Timestamp };
	location?: {
		name: string;
		address: string;
		geopoint: GeoPoint;
	};
	status: 'active' | 'ready';
	participantIds: string[];
	creatorId: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

// Firestore에 저장할 때는 id를 제외
export type PlansInput = Omit<PlansCollection, 'id'>;

// Plan 생성 시 필요한 입력
export type CreatePlansInput = Pick<
	PlansCollection,
	'title' | 'body' | 'category' | 'creatorId' | 'status'
>;

// Members 서브컬렉션
export interface MembersCollection {
	id: string; // userId
	status: 'invite' | 'waiting-approval';
	updatedAt: Timestamp;
	inviterId?: string;
}

// TimeSlots 서브컬렉션
export interface TimeSlotsCollection {
	id: string; // userId
	slots: TimeSlotStamp[];
	createdAt: Timestamp;
	updatedAt: Timestamp;
}

// Firestore에 저장할 때는 id를 제외
export type TimeSlotsInput = Omit<TimeSlotsCollection, 'id'>;

// TimeSlots 저장 시 필요한 입력
export type SaveTimeSlotsInput = {
	partyId: string;
	planId: string;
	userId: string;
	slots: TimeSlotStamp[];
};

// userName이 포함된 TimeSlotsCollection (클라이언트 사이드용)
export interface TimeSlotsWithUserName extends TimeSlotsCollection {
	userName: string;
}
