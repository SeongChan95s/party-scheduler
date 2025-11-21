import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DayCellContentArg } from '@fullcalendar/core';
import { useMemo, useRef } from 'react';
import { useUserState } from '@/hooks/auth/useUserStateChanged';
import { usePartyAvailabilities, useAvailabilityMutations } from '@/hooks/party';
import styles from './SelectCalendar.module.scss';
import { Skeleton } from '../common/Skeleton';
import {
	useCalendarEvents,
	useCalendarHandlers,
	useCurrentView
} from './SelectCalendar.hooks';
import {
	USER_COLORS,
	getOverlapColor,
	calculateDailyMaxOverlap
} from './SelectCalendar.utils';

interface MyCalendarProps {
	partyId: string;
}

export default function SelectCalendar({ partyId }: MyCalendarProps) {
	const user = useUserState(state => state.user);
	const calendarRef = useRef<FullCalendar>(null);
	const { currentView, setCurrentView } = useCurrentView();

	const { availabilities, isLoading, overlappingSlots } = usePartyAvailabilities(partyId);

	// 가용 시간 저장/삭제
	const { save: saveAvailability } = useAvailabilityMutations(partyId);

	// 캘린더 이벤트 변환
	const { fullCalendarEvents, totalParticipants } = useCalendarEvents({
		availabilities,
		overlappingSlots,
		user
	});

	// 날짜별 최대 겹치는 인원수 계산
	const dailyMaxOverlap = useMemo(
		() => calculateDailyMaxOverlap(overlappingSlots),
		[overlappingSlots]
	);

	// 이벤트 핸들러들
	const {
		handleMouseDown,
		handleSelect,
		handleEventClick,
		handleEventDrop,
		handleEventResize,
		handleDatesSet
	} = useCalendarHandlers({
		user,
		currentView,
		availabilities,
		partyId,
		saveAvailability,
		calendarRef
	});

	// 뷰 변경 핸들러
	const handleDatesSetWithViewUpdate = (dateInfo: Parameters<typeof handleDatesSet>[0]) => {
		const viewType = handleDatesSet(dateInfo);
		setCurrentView(viewType);
	};

	// 월별 뷰에서 겹치는 인원수 표시
	const renderDayCellContent = (arg: DayCellContentArg) => {
		if (arg.view.type === 'dayGridMonth') {
			const newDay = new Date();
			newDay.setDate(arg.date.getDate());
			const dateKey = newDay.toISOString().split('T')[0];
			const maxOverlap = dailyMaxOverlap.get(dateKey);

			return (
				<div className={styles.dayCell}>
					<div className={styles.dayNumber}>{arg.dayNumberText}</div>
					{maxOverlap && maxOverlap >= 2 && (
						<div
							className={styles.overlapBadge}
							style={{
								backgroundColor: `red`,
								color: '#fff'
							}}>
							{maxOverlap}
						</div>
					)}
				</div>
			);
		}

		return arg.dayNumberText;
	};

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
		<div className={styles.calendarContainer} onMouseDown={handleMouseDown}>
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

			<div className="h-[calc(100vh-79px)]">
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
					height="100%"
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
					datesSet={handleDatesSetWithViewUpdate}
					allDaySlot={false}
					expandRows={true}
					stickyHeaderDates={true}
					nowIndicator={true}
					slotEventOverlap={false}
					dayCellContent={renderDayCellContent}
				/>
			</div>
		</div>
	);
}
