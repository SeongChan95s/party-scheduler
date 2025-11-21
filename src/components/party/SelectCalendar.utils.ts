import type { TimeSlotStamp } from '@/types/party';
import styles from './SelectCalendar.module.scss';
import type { DayCellContentArg } from '@fullcalendar/core/index.js';

export const USER_COLORS = [
	'#4A90E2', // 파랑
	'#7B68EE', // 보라
	'#20B2AA', // 청록
	'#FF6B6B', // 빨강
	'#F39C12', // 주황
	'#27AE60', // 녹색
	'#E91E63', // 핑크
	'#9C27B0' // 자주
];

/**
 * 인원수에 따른 색상 전환
 */
export const getOverlapColor = (count: number, totalParticipants: number): string => {
	if (totalParticipants <= 1) return '#FFF3B0'; // 기본 연한 노랑

	// 비율 계산 (2명부터 시작하므로 count-1 사용)
	const ratio = Math.min((count - 1) / (totalParticipants - 1), 1);

	// 연한 노랑(#FFF3B0) -> 진한 녹색(#2E7D32)
	const r = Math.round(255 - ratio * (255 - 46));
	const g = Math.round(243 - ratio * (243 - 125));
	const b = Math.round(176 - ratio * (176 - 50));

	return `rgb(${r}, ${g}, ${b})`;
};

/**
 * 시간대가 겹치는지 확인하는 헬퍼 함수
 */
export const hasTimeConflict = (
	start: Date,
	end: Date,
	slots: TimeSlotStamp[],
	excludeIndex?: number
): boolean => {
	return slots.some((slot, index) => {
		if (excludeIndex !== undefined && index === excludeIndex) return false;
		const slotStart = slot.start.toDate();
		const slotEnd = slot.end.toDate();
		return start < slotEnd && end > slotStart;
	});
};

/**
 * 날짜별 최대 겹치는 인원수 계산
 */
export const calculateDailyMaxOverlap = (
	overlappingSlots: Array<{ slot: TimeSlotStamp; count: number }>
): Map<string, number> => {
	const dailyMap = new Map<string, number>();

	overlappingSlots.forEach(overlap => {
		const dateKey = overlap.slot.start.toDate().toISOString().split('T')[0];

		const currentMax = dailyMap.get(dateKey) || 0;
		if (overlap.count > currentMax) {
			dailyMap.set(dateKey, overlap.count);
		}
	});

	return dailyMap;
};
