import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type {
	EventClickArg,
	EventDropArg,
	DateSelectArg,
	EventInput,
	DatesSetArg
} from '@fullcalendar/core';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useGlobalToastStore } from '../global/popup/GlobalToast';
import { useUserState } from '@/hooks/auth/useUserStateChanged';
import { usePartyAvailabilities, useAvailabilityMutations } from '@/hooks/party';
import { timeSlotToDate } from '@/services/party';
import type { CalendarEvent, TimeSlot } from '@/types/party';
import styles from './MyCalendar.module.scss';
import { Skeleton } from '../common/Skeleton';

interface MyCalendarProps {
	partyId: string;
}

const USER_COLORS = [
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
const getOverlapColor = (count: number, totalParticipants: number): string => {
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
const hasTimeConflict = (
	start: Date,
	end: Date,
	slots: TimeSlot[],
	excludeIndex?: number
): boolean => {
	return slots.some((slot, index) => {
		if (excludeIndex !== undefined && index === excludeIndex) return false;
		const slotStart = slot.start.toDate();
		const slotEnd = slot.end.toDate();
		return start < slotEnd && end > slotStart;
	});
};

export default function MyCalendar({ partyId }: MyCalendarProps) {
	const user = useUserState(state => state.user);
	const calendarRef = useRef<FullCalendar>(null);
	const [currentView, setCurrentView] = useState<string>('timeGridWeek');

	const { availabilities, isLoading, overlappingSlots } = usePartyAvailabilities(partyId);

	// 가용 시간 저장/삭제
	const { save: saveAvailability } = useAvailabilityMutations(partyId);

	// 사용자별 색상 매핑
	const userColorMap = useMemo(() => {
		const map = new Map<string, string>();
		if (availabilities) {
			availabilities.forEach((availability, index) => {
				map.set(availability.userId, USER_COLORS[index % USER_COLORS.length]);
			});
		}
		return map;
	}, [availabilities]);

	// 가용 시간을 캘린더 이벤트로 변환
	const calendarEvents = useMemo((): CalendarEvent[] => {
		if (!availabilities) return [];

		const events: CalendarEvent[] = [];

		// 각 사용자의 가용 시간대를 이벤트로 변환
		availabilities.forEach(availability => {
			availability.slots.forEach((slot, slotIndex) => {
				const { start, end } = timeSlotToDate(slot);
				const isMyEvent = availability.userId === user?.uid;

				events.push({
					id: `${availability.userId}-${slotIndex}`,
					title: isMyEvent ? '내 가용 시간' : availability.userName,
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

	// 총 참가자 수
	const totalParticipants = availabilities?.length || 0;

	// 날짜별 최대 겹치는 인원수 계산
	const dailyMaxOverlap = useMemo(() => {
		const dailyMap = new Map<string, number>();

		overlappingSlots.forEach(overlap => {
			const dateKey = overlap.slot.start.toDate().toISOString().split('T')[0];
			const currentMax = dailyMap.get(dateKey) || 0;
			if (overlap.count > currentMax) {
				dailyMap.set(dateKey, overlap.count);
			}
		});

		return dailyMap;
	}, [overlappingSlots]);

	// FullCalendar용 이벤트 데이터로 변환
	const fullCalendarEvents = useMemo((): EventInput[] => {
		return calendarEvents.map(event => {
			let backgroundColor: string;
			let borderColor: string;
			let textColor = '#fff';
			let classNames: string[] = [];
			let display: 'auto' | 'background' = 'auto';

			if (event.isOverlapping && event.overlapCount) {
				// 겹치는 시간대도 background로 표시
				backgroundColor = getOverlapColor(event.overlapCount, totalParticipants);
				const isFullOverlap = event.overlapCount === totalParticipants;
				borderColor = isFullOverlap ? '#1B5E20' : '#8BC34A';
				textColor = event.overlapCount >= totalParticipants * 0.7 ? '#fff' : '#000';
				classNames = [styles.overlappingEvent];
				display = 'background';
			} else if (event.isMyEvent) {
				backgroundColor = userColorMap.get(event.userId!) || '#4A90E2';
				borderColor = '#2E6BB0';
				classNames = [styles.myEvent];
			} else {
				// 다른 사람의 이벤트는 background로 표시
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

	// 새 가용 시간 추가
	const handleSelect = useCallback(
		(selectInfo: DateSelectArg) => {
			if (!user) {
				useGlobalToastStore.getState().push({ message: '로그인이 필요합니다.' });
				return;
			}

			console.log('selectInfo', selectInfo);
			// 월간 뷰에서는 주간 뷰로 전환
			if (currentView === 'dayGridMonth') {
				const calendarApi = calendarRef.current?.getApi();
				if (calendarApi) {
					calendarApi.changeView('timeGridWeek', selectInfo.start);
				}
				return;
			}

			// 현재 사용자의 기존 가용 시간 가져오기
			const myAvailability = availabilities?.find(a => a.userId === user.uid);
			const existingSlots: TimeSlot[] = myAvailability?.slots || [];

			// 기존 가용 시간과 겹치는지 확인
			if (hasTimeConflict(selectInfo.start, selectInfo.end, existingSlots)) {
				useGlobalToastStore
					.getState()
					.push({ message: '해당 시간에 이미 가용 시간이 있습니다.' });
				return;
			}

			// 새 시간대 추가
			const newSlot: TimeSlot = {
				start: Timestamp.fromDate(selectInfo.start),
				end: Timestamp.fromDate(selectInfo.end)
			};

			const updatedSlots = [...existingSlots, newSlot];

			// Firebase에 저장
			saveAvailability(
				{
					partyId,
					userId: user.uid,
					userName: user.displayName || '익명',
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
		[user, currentView, availabilities, partyId, saveAvailability]
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
					userName: user.displayName || '익명',
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
				userName: user.displayName || '익명',
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
				userName: user.displayName || '익명',
				slots: updatedSlots
			});
		},
		[user, availabilities, partyId, saveAvailability]
	);

	// 뷰/날짜 변경 추적
	const handleDatesSet = useCallback((dateInfo: DatesSetArg) => {
		setCurrentView(dateInfo.view.type);
	}, []);

	if (isLoading) {
		return (
			<div>
				<div className="flex justify-between gap-32 mb-32">
					<Skeleton className="flex-1" />
					<Skeleton className="flex-2" />
					<Skeleton className="flex-1" />
				</div>
				<div className="grid grid-cols-7 gap-x-21 gap-y-16">
					{Array.from({ length: 35 }).map((_el, i) => (
						<Skeleton key={`skeleton_${i}`} />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className={styles.calendarContainer}>
			<div className={styles.legend}>
				<div className={styles.legendItem}>
					<span
						className={styles.legendColor}
						style={{
							background: `linear-gradient(to right, ${getOverlapColor(
								2,
								totalParticipants
							)}, ${getOverlapColor(totalParticipants, totalParticipants)})`
						}}
					/>
					<span>겹치는 시간대 (2명~{totalParticipants}명)</span>
				</div>
				{availabilities?.map((availability, index) => (
					<div key={availability.userId} className={styles.legendItem}>
						<span
							className={styles.legendColor}
							style={{
								backgroundColor: USER_COLORS[index % USER_COLORS.length]
							}}
						/>
						<span>
							{availability.userId === user?.uid ? '나' : availability.userName}
						</span>
					</div>
				))}
			</div>

			<FullCalendar
				ref={calendarRef}
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="timeGridWeek"
				headerToolbar={{
					left: 'prev,next today',
					center: 'title',
					right: 'dayGridMonth,timeGridWeek, timeGridDay'
				}}
				locale="ko"
				events={fullCalendarEvents}
				selectable={true}
				editable={true}
				selectMirror={true}
				dayMaxEvents={true}
				weekends={true}
				select={handleSelect}
				eventClick={handleEventClick}
				eventDrop={handleEventDrop}
				eventResize={handleEventResize}
				datesSet={handleDatesSet}
				allDaySlot={false}
				slotMinTime="06:00:00"
				slotMaxTime="24:00:00"
				height="auto"
				expandRows={true}
				stickyHeaderDates={true}
				nowIndicator={true}
				dayCellContent={arg => {
					// 월별 뷰에서만 최대 겹치는 인원수 표시
					if (arg.view.type === 'dayGridMonth') {
						const dateKey = arg.date.toISOString().split('T')[0];
						const maxOverlap = dailyMaxOverlap.get(dateKey);

						// 겹치는 인원수에 따른 opacity 계산
						const getMonthViewOpacity = (count: number, total: number): number => {
							if (total <= 1) return 0.2;
							const ratio = Math.min((count - 1) / (total - 1), 1);
							return 0.2 + ratio * 0.8; // 0.2 ~ 1.0
						};

						return (
							<div className={styles.dayCell}>
								<div className={styles.dayNumber}>{arg.dayNumberText}</div>
								{maxOverlap && maxOverlap >= 2 && (
									<div
										className={styles.overlapBadge}
										style={{
											backgroundColor: `rgba(255, 0, 0, ${getMonthViewOpacity(
												maxOverlap,
												totalParticipants
											)})`,
											color: maxOverlap >= totalParticipants * 0.7 ? '#fff' : '#000'
										}}>
										{maxOverlap}
									</div>
								)}
							</div>
						);
					}
					return arg.dayNumberText;
				}}
			/>
		</div>
	);
}
