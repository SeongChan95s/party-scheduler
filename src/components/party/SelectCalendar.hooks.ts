import { useCallback, useMemo, useRef, useState } from 'react';
import type {
	EventClickArg,
	EventDropArg,
	DateSelectArg,
	EventInput,
	DatesSetArg
} from '@fullcalendar/core';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import { Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { useGlobalToastStore } from '../global/popup/GlobalToast';
import { timeSlotToDate } from '@/services/party';
import type {
	CalendarEvent,
	TimeSlotStamp,
	AvailabilityWithUserName
} from '@/types/party';
import { getOverlapColor, hasTimeConflict, USER_COLORS } from './SelectCalendar.utils';
import styles from './SelectCalendar.module.scss';

interface UseCalendarEventsParams {
	availabilities: AvailabilityWithUserName[] | undefined;
	overlappingSlots: Array<{ slot: TimeSlotStamp; count: number; userNames: string[] }>;
	user: User | null;
}

/**
 * 가용 시간을 캘린더 이벤트로 변환하는 hook
 */
export const useCalendarEvents = ({
	availabilities,
	overlappingSlots,
	user
}: UseCalendarEventsParams) => {
	const userColorMap = useMemo(() => {
		const map = new Map<string, string>();
		if (availabilities) {
			availabilities.forEach((availability, index) => {
				map.set(availability.userId, USER_COLORS[index % USER_COLORS.length]);
			});
		}
		return map;
	}, [availabilities]);

	/**
	 * 가용 시간대 slots의 TimeStamp를 Date로 변환,
	 * 내 이벤트인지 데이터 부여,
	 * 겹치는 시간대 별도 이벤트로 추가
	 */
	const calendarEvents = useMemo((): CalendarEvent[] => {
		if (!availabilities) return [];

		const events: CalendarEvent[] = [];

		availabilities.forEach(availability => {
			availability.slots.forEach((slot, slotIndex) => {
				const { start, end } = timeSlotToDate(slot);
				const isMyEvent = availability.userId === user?.uid;

				events.push({
					id: `${availability.userId}-${slotIndex}`,
					title: availability.userName,
					start,
					end,
					userId: availability.userId,
					userName: availability.userName,
					isMyEvent
				});
			});
		});

		// 겹치는 시간대를 별도 이벤트로 추가
		overlappingSlots.forEach((overlap, index) => {
			const { start, end } = timeSlotToDate(overlap.slot);
			events.push({
				id: `overlap-${index}`,
				title: `${overlap.count}명`,
				start,
				end,
				isOverlapping: true,
				userName: overlap.userNames.join(', '),
				overlapCount: overlap.count
			});
		});

		return events;
	}, [availabilities, overlappingSlots, user?.uid]);

	const totalParticipants = availabilities?.length || 0;

	/**
	 *  FullCalendar 이벤트 타입의 데이터로 변환
	 */
	const fullCalendarEvents = useMemo((): EventInput[] => {
		return calendarEvents.map(event => {
			let backgroundColor: string;
			let borderColor: string;
			let textColor = '#fff';
			let classNames: string[] = [];
			let display: 'auto' | 'background' = 'auto';

			if (event.isOverlapping && event.overlapCount) {
				// 겹치는 시간대 -> background event
				backgroundColor = getOverlapColor(event.overlapCount, totalParticipants);
				const isFullOverlap = event.overlapCount === totalParticipants;
				borderColor = isFullOverlap ? '#1B5E20' : '#8BC34A';
				textColor = event.overlapCount >= totalParticipants * 0.7 ? '#fff' : '#000';
				classNames = [styles.overlappingEvent];
				display = 'background';
				// 나의 이벤트
			} else if (event.isMyEvent) {
				backgroundColor = userColorMap.get(event.userId!) || '#4A90E2';
				borderColor = '#2E6BB0';
				classNames = [styles.myEvent];
			} else {
				// 다른 사람의 이벤트 -> background event
				backgroundColor = userColorMap.get(event.userId!) || '#888';
				borderColor = 'transparent';
				classNames = [styles.otherEvent];
				display = 'background';
			}

			return {
				id: event.id,
				title: event.title,
				start: event.start,
				end: event.end,
				backgroundColor,
				borderColor,
				textColor,
				classNames,
				display,
				editable: event.isMyEvent === true,
				extendedProps: {
					userId: event.userId,
					userName: event.userName,
					isMyEvent: event.isMyEvent,
					isOverlapping: event.isOverlapping,
					overlapCount: event.overlapCount
				}
			};
		});
	}, [calendarEvents, userColorMap, totalParticipants]);

	return { fullCalendarEvents, totalParticipants, userColorMap };
};

interface UseCalendarHandlersParams {
	user: User | null;
	currentView: string;
	availabilities: AvailabilityWithUserName[] | undefined;
	partyId: string;
	saveAvailability: (
		data: {
			partyId: string;
			userId: string;
			slots: TimeSlotStamp[];
		},
		options?: {
			onSuccess?: () => void;
			onError?: () => void;
		}
	) => void;
	calendarRef: React.RefObject<any>;
}

/**
 * FullCalendar 이벤트 핸들러들을 관리하는 hook
 */
export const useCalendarHandlers = ({
	user,
	currentView,
	availabilities,
	partyId,
	saveAvailability,
	calendarRef
}: UseCalendarHandlersParams) => {
	const mouseDownTime = useRef<number>(0);

	const handleMouseDown = useCallback(() => {
		mouseDownTime.current = Date.now();
	}, []);

	// 새 가용 시간 추가
	const handleSelect = useCallback(
		(selectInfo: DateSelectArg) => {
			const clickDuration = Date.now() - mouseDownTime.current;

			if (!user) {
				useGlobalToastStore.getState().push({ message: '로그인이 필요합니다.' });
				return;
			}

			// 월간 뷰에서는 주간 뷰로 전환
			if (currentView === 'dayGridMonth' && clickDuration <= 300) {
				const calendarApi = calendarRef.current?.getApi();
				if (calendarApi) {
					calendarApi.changeView('timeGridWeek', selectInfo.start);
				}
				return;
			}

			// 사용자의 가용 시간이 기존 가용 시간과 겹치는지 확인
			const myAvailability = availabilities?.find(a => a.userId === user.uid);
			const existingSlots: TimeSlotStamp[] = myAvailability?.slots || [];
			if (hasTimeConflict(selectInfo.start, selectInfo.end, existingSlots)) {
				useGlobalToastStore
					.getState()
					.push({ message: '해당 시간에 이미 가용 시간이 있습니다.' });
				return;
			}

			// 새 시간대 추가
			const newSlot: TimeSlotStamp = {
				start: Timestamp.fromDate(selectInfo.start),
				end: Timestamp.fromDate(selectInfo.end)
			};

			const updatedSlots = [...existingSlots, newSlot];

			saveAvailability(
				{
					partyId,
					userId: user.uid,
					slots: updatedSlots
				},
				{
					onSuccess: () => {
						useGlobalToastStore
							.getState()
							.push({ message: '가용 시간이 추가되었습니다.' });
					},
					onError: () => {
						useGlobalToastStore.getState().push({ message: '저장에 실패했습니다.' });
					}
				}
			);
		},
		[user, currentView, availabilities, partyId, saveAvailability, calendarRef]
	);

	// 이벤트 클릭 (삭제 기능)
	const handleEventClick = useCallback(
		(clickInfo: EventClickArg) => {
			const { extendedProps } = clickInfo.event;

			if (!user || !extendedProps.isMyEvent) {
				// 겹치는 시간대 정보 표시
				if (extendedProps.isOverlapping) {
					useGlobalToastStore
						.getState()
						.push({ message: `가능한 참가자: ${extendedProps.userName}` });
				}
				return;
			}

			const confirmed = window.confirm('이 가용 시간을 삭제하시겠습니까?');
			if (!confirmed) return;

			const myAvailability = availabilities?.find(a => a.userId === user.uid);
			if (!myAvailability) return;

			const slotIndex = parseInt(clickInfo.event.id.split('-')[1], 10);
			const updatedSlots = myAvailability.slots.filter((_, index) => index !== slotIndex);

			saveAvailability(
				{
					partyId,
					userId: user.uid,
					slots: updatedSlots
				},
				{
					onSuccess: () => {
						useGlobalToastStore
							.getState()
							.push({ message: '가용 시간이 삭제되었습니다.' });
					}
				}
			);
		},
		[user, availabilities, partyId, saveAvailability]
	);

	// 이벤트 이동 (내 이벤트만 가능)
	const handleEventDrop = useCallback(
		(dropInfo: EventDropArg) => {
			const { extendedProps } = dropInfo.event;

			if (!user || !extendedProps.isMyEvent) {
				useGlobalToastStore
					.getState()
					.push({ message: '본인의 가용 시간만 수정할 수 있습니다.' });
				dropInfo.revert();
				return;
			}

			const newStart = dropInfo.event.start;
			const newEnd = dropInfo.event.end;

			if (!newStart || !newEnd) {
				dropInfo.revert();
				return;
			}

			// 현재 사용자의 가용 시간 업데이트
			const myAvailability = availabilities?.find(a => a.userId === user.uid);
			if (!myAvailability) {
				dropInfo.revert();
				return;
			}

			// 이벤트 ID에서 슬롯 인덱스 추출
			const slotIndex = parseInt(dropInfo.event.id.split('-')[1], 10);

			// 다른 가용 시간과 겹치는지 확인 (자기 자신 제외)
			if (hasTimeConflict(newStart, newEnd, myAvailability.slots, slotIndex)) {
				useGlobalToastStore
					.getState()
					.push({ message: '해당 시간에 이미 가용 시간이 있습니다.' });
				dropInfo.revert();
				return;
			}

			const updatedSlots = myAvailability.slots.map((slot, index) => {
				if (index === slotIndex) {
					return {
						start: Timestamp.fromDate(newStart),
						end: Timestamp.fromDate(newEnd)
					};
				}
				return slot;
			});

			saveAvailability({
				partyId,
				userId: user.uid,
				slots: updatedSlots
			});
		},
		[user, availabilities, partyId, saveAvailability]
	);

	// 이벤트 리사이즈 (내 이벤트만 가능)
	const handleEventResize = useCallback(
		(resizeInfo: EventResizeDoneArg) => {
			const { extendedProps } = resizeInfo.event;

			if (!user || !extendedProps.isMyEvent) {
				resizeInfo.revert();
				return;
			}

			const newStart = resizeInfo.event.start;
			const newEnd = resizeInfo.event.end;

			if (!newStart || !newEnd) {
				resizeInfo.revert();
				return;
			}

			const myAvailability = availabilities?.find(a => a.userId === user.uid);
			if (!myAvailability) {
				resizeInfo.revert();
				return;
			}

			const slotIndex = parseInt(resizeInfo.event.id.split('-')[1], 10);

			// 다른 가용 시간과 겹치는지 확인 (자기 자신 제외)
			if (hasTimeConflict(newStart, newEnd, myAvailability.slots, slotIndex)) {
				useGlobalToastStore
					.getState()
					.push({ message: '해당 시간에 이미 가용 시간이 있습니다.' });
				resizeInfo.revert();
				return;
			}

			const updatedSlots = myAvailability.slots.map((slot, index) => {
				if (index === slotIndex) {
					return {
						start: Timestamp.fromDate(newStart),
						end: Timestamp.fromDate(newEnd)
					};
				}
				return slot;
			});

			saveAvailability({
				partyId,
				userId: user.uid,
				slots: updatedSlots
			});
		},
		[user, availabilities, partyId, saveAvailability]
	);

	// 뷰/날짜 변경 추적
	const handleDatesSet = useCallback((dateInfo: DatesSetArg) => {
		return dateInfo.view.type;
	}, []);

	return {
		handleMouseDown,
		handleSelect,
		handleEventClick,
		handleEventDrop,
		handleEventResize,
		handleDatesSet
	};
};

/**
 * 현재 뷰 상태를 관리하는 hook
 */
export const useCurrentView = () => {
	const [currentView, setCurrentView] = useState<string>('timeGridWeek');
	return { currentView, setCurrentView };
};
