import {
	Calendar,
	momentLocalizer,
	type EventPropGetter,
	type SlotInfo,
	type View
} from 'react-big-calendar';
import withDragAndDrop, {
	type EventInteractionArgs
} from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useGlobalToastStore } from '../global/popup/GlobalToast';
import { useUserState } from '@/hooks/auth/useUserStateChanged';
import { usePartyAvailabilities, useAvailabilityMutations } from '@/hooks/party';
import { timeSlotToDate } from '@/services/party';
import type { CalendarEvent, TimeSlot } from '@/types/party';
import styles from './MyCalendar.module.scss';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface MyCalendarProps {
	partyId: string;
}

const DnDCalendar = withDragAndDrop<CalendarEvent>(Calendar);
const localizer = momentLocalizer(moment);

const LONG_PRESS_THRESHOLD = 300;

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

// 겹치는 인원수에 따른 색상 (연한 노랑 -> 진한 녹색)
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

// 시간대가 겹치는지 확인하는 헬퍼 함수
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
	const [view, setView] = useState<View>('week');
	const [date, setDate] = useState(new Date());
	const mouseDownTime = useRef<number>(0);

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
				title: `${overlap.count}명 가능`,
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

	// 이벤트 스타일 지정
	const eventPropGetter = useCallback<EventPropGetter<CalendarEvent>>(
		event => {
			if (event.isOverlapping && event.overlapCount) {
				const bgColor = getOverlapColor(event.overlapCount, totalParticipants);
				const isFullOverlap = event.overlapCount === totalParticipants;

				return {
					className: styles.overlappingEvent,
					style: {
						backgroundColor: bgColor,
						borderColor: isFullOverlap ? '#1B5E20' : '#8BC34A',
						color: event.overlapCount >= totalParticipants * 0.7 ? '#fff' : '#000',
						fontWeight: 'bold',
						zIndex: 10
					}
				};
			}

			if (event.isMyEvent) {
				return {
					className: styles.myEvent,
					style: {
						backgroundColor: userColorMap.get(event.userId!) || '#4A90E2',
						borderColor: '#2E6BB0'
					}
				};
			}

			// 다른 사용자의 이벤트
			return {
				className: styles.otherEvent,
				style: {
					backgroundColor: userColorMap.get(event.userId!) || '#888',
					opacity: 0.6,
					borderColor: 'transparent'
				}
			};
		},
		[userColorMap, totalParticipants]
	);

	const handleMouseDown = useCallback(() => {
		mouseDownTime.current = Date.now();
	}, []);

	// 새 가용 시간 추가
	const createEvent = useCallback(
		(slotInfo: SlotInfo) => {
			if (!user) {
				useGlobalToastStore.getState().push({ message: '로그인이 필요합니다.' });
				return;
			}

			const clickDuration = Date.now() - mouseDownTime.current;

			// 월간 뷰에서 짧은 클릭은 주간 뷰로 전환
			if (view === 'month' && clickDuration < LONG_PRESS_THRESHOLD) {
				setDate(slotInfo.start);
				setView('week');
				return;
			}

			// 현재 사용자의 기존 가용 시간 가져오기
			const myAvailability = availabilities?.find(a => a.userId === user.uid);
			const existingSlots: TimeSlot[] = myAvailability?.slots || [];

			// 기존 가용 시간과 겹치는지 확인
			if (hasTimeConflict(slotInfo.start, slotInfo.end, existingSlots)) {
				useGlobalToastStore
					.getState()
					.push({ message: '해당 시간에 이미 가용 시간이 있습니다.' });
				return;
			}

			// 새 시간대 추가
			const newSlot: TimeSlot = {
				start: Timestamp.fromDate(slotInfo.start),
				end: Timestamp.fromDate(slotInfo.end)
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
		[user, view, availabilities, partyId, saveAvailability]
	);

	// 이벤트 이동 (내 이벤트만 가능)
	const moveEvent = useCallback(
		({ event, start, end }: EventInteractionArgs<CalendarEvent>) => {
			if (!user || !event.isMyEvent) {
				useGlobalToastStore
					.getState()
					.push({ message: '본인의 가용 시간만 수정할 수 있습니다.' });
				return;
			}

			const newStart = new Date(start);
			const newEnd = new Date(end);

			// 현재 사용자의 가용 시간 업데이트
			const myAvailability = availabilities?.find(a => a.userId === user.uid);
			if (!myAvailability) return;

			// 이벤트 ID에서 슬롯 인덱스 추출
			const slotIndex = parseInt(event.id.split('-')[1], 10);

			// 다른 가용 시간과 겹치는지 확인 (자기 자신 제외)
			if (hasTimeConflict(newStart, newEnd, myAvailability.slots, slotIndex)) {
				useGlobalToastStore
					.getState()
					.push({ message: '해당 시간에 이미 가용 시간이 있습니다.' });
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
	const resizeEvent = useCallback(
		({ event, start, end }: EventInteractionArgs<CalendarEvent>) => {
			if (!user || !event.isMyEvent) {
				return;
			}

			const newStart = new Date(start);
			const newEnd = new Date(end);

			const myAvailability = availabilities?.find(a => a.userId === user.uid);
			if (!myAvailability) return;

			const slotIndex = parseInt(event.id.split('-')[1], 10);

			// 다른 가용 시간과 겹치는지 확인 (자기 자신 제외)
			if (hasTimeConflict(newStart, newEnd, myAvailability.slots, slotIndex)) {
				useGlobalToastStore
					.getState()
					.push({ message: '해당 시간에 이미 가용 시간이 있습니다.' });
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

	// 이벤트 클릭 (삭제 기능)
	const handleSelectEvent = useCallback(
		(event: CalendarEvent) => {
			if (!user || !event.isMyEvent) {
				// 겹치는 시간대 정보 표시
				if (event.isOverlapping) {
					useGlobalToastStore
						.getState()
						.push({ message: `가능한 참가자: ${event.userName}` });
				}
				return;
			}

			const confirmed = window.confirm('이 가용 시간을 삭제하시겠습니까?');
			if (!confirmed) return;

			const myAvailability = availabilities?.find(a => a.userId === user.uid);
			if (!myAvailability) return;

			const slotIndex = parseInt(event.id.split('-')[1], 10);
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

	// 드래그 가능 여부 체크
	const draggableAccessor = useCallback((event: CalendarEvent) => {
		return event.isMyEvent === true;
	}, []);

	if (isLoading) {
		return <div className={styles.loading}>로딩 중...</div>;
	}

	return (
		<div className={styles.calendarContainer} onMouseDown={handleMouseDown}>
			<div className={styles.legend}>
				<div className={styles.legendItem}>
					<span
						className={styles.legendColor}
						style={{
							background: `linear-gradient(to right, ${getOverlapColor(2, totalParticipants)}, ${getOverlapColor(totalParticipants, totalParticipants)})`
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

			<DnDCalendar
				localizer={localizer}
				view={view}
				date={date}
				events={calendarEvents}
				eventPropGetter={eventPropGetter}
				draggableAccessor={draggableAccessor}
				dayLayoutAlgorithm="no-overlap"
				allDayMaxRows={2}
				onView={setView}
				onNavigate={setDate}
				onSelectSlot={createEvent}
				onSelectEvent={handleSelectEvent}
				onEventDrop={moveEvent}
				onEventResize={resizeEvent}
				resizable={true}
				selectable={true}
			/>
		</div>
	);
}
