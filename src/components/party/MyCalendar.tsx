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
import { useCallback, useRef, useState } from 'react';
import { useGlobalToastStore } from '../global/popup/GlobalToast';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface Event {
	id: number;
	title: string;
	start: Date;
	end: Date;
	allDay?: boolean;
	desc?: string;
}

const DnDCalendar = withDragAndDrop<Event>(Calendar);
const localizer = momentLocalizer(moment);

const events: Event[] = [
	{
		id: 0,
		title: 'All Day Event very long title',
		allDay: true,
		start: new Date(2025, 10, 19, 0, 0, 0),
		end: new Date(2025, 10, 20, 0, 0, 0)
	},
	{
		id: 1,
		title: 'Meeting',
		start: new Date(2025, 10, 22, 10, 30, 0, 0), // year, monthIndex, day, hours, minutes, seconds, milliseconds
		end: new Date(2025, 10, 22, 12, 30, 0, 0),
		desc: 'Pre-meeting meeting, to prepare for the meeting'
	},
	{
		id: 2,
		title: 'save',
		start: new Date(2025, 10, 18, 10, 30, 0, 0), // year, monthIndex, day, hours, minutes, seconds, milliseconds
		end: new Date(2025, 10, 18, 12, 30, 0, 0),
		desc: 'Pre-meeting meeting, to prepare for the meeting'
	}
];
const backgroundEvents: Event[] = [
	{
		id: 4,
		title: 'bg1',
		allDay: true,
		start: new Date(2025, 10, 19, 0, 0, 0),
		end: new Date(2025, 10, 19, 24, 0, 0)
	},
	{
		id: 5,
		title: 'bg2',
		start: new Date(2025, 10, 20, 10, 30, 0, 0), // year, monthIndex, day, hours, minutes, seconds, milliseconds
		end: new Date(2025, 10, 20, 12, 30, 0, 0),
		desc: 'Pre-meeting meeting, to prepare for the meeting'
	}
];

/**
 * 이벤트가 다른 이벤트와 겹치지 않는지 체크
 * @param excludeId 충돌 검사에서 제외할 이벤트 ID (자기 자신)
 */
const hasConflict = (
	start: Date,
	end: Date,
	eventList: Event[],
	excludeId?: number
): boolean => {
	return eventList.some(ev => {
		if (excludeId !== undefined && ev.id === excludeId) return false;
		return start < ev.end && end > ev.start;
	});
};

const LONG_PRESS_THRESHOLD = 300;

export default function MyCalendar() {
	const [myEvents, setMyEvents] = useState(events);

	const [view, setView] = useState<View>('month');
	const [date, setDate] = useState(new Date());
	const mouseDownTime = useRef<number>(0);

	const handleMouseDown = useCallback(() => {
		mouseDownTime.current = Date.now();
	}, []);

	const createEvent = useCallback(
		(slotInfo: SlotInfo) => {
			const clickDuration = Date.now() - mouseDownTime.current;

			// 날짜 뷰
			if (view == 'month' && clickDuration < LONG_PRESS_THRESHOLD) {
				setDate(slotInfo.start);
				setView('week');
				return;
			}

			// 일정 추가
			if (hasConflict(slotInfo.start, slotInfo.end, myEvents)) {
				useGlobalToastStore
					.getState()
					.push({ message: '해당 시간에 이미 다른 일정이 있습니다.' });
				return;
			}

			setMyEvents(prev => {
				const title = window.prompt('이벤트명을 입력하세요.');
				const idList = prev.map(item => item.id);
				const newId = Math.max(...idList) + 1;

				if (title) {
					return [
						...prev,
						{
							id: newId,
							title,
							start: slotInfo.start,
							end: slotInfo.end
						}
					];
				}

				return prev;
			});
		},
		[myEvents]
	);

	const moveEvent = useCallback(
		({
			event,
			start,
			end,
			isAllDay: droppedOnAllDaySlot = false
		}: EventInteractionArgs<Event>) => {
			const newStart = new Date(start);
			const newEnd = new Date(end);

			const { allDay } = event;
			const newAllDay = droppedOnAllDaySlot
				? true
				: allDay && !droppedOnAllDaySlot
				? false
				: allDay;

			// 충돌 검사 (자기 자신은 제외)
			if (hasConflict(newStart, newEnd, myEvents, event.id)) {
				useGlobalToastStore
					.getState()
					.push({ message: '해당 시간에 이미 다른 일정이 있습니다.' });
				return;
			}

			setMyEvents(prev => {
				const existing = prev.find(ev => ev.id === event.id);
				if (!existing) return prev;
				const filtered = prev.filter(ev => ev.id !== event.id);
				return [
					...filtered,
					{
						...existing,
						start: newStart,
						end: newEnd,
						allDay: newAllDay
					}
				];
			});
		},
		[myEvents]
	);

	const resizeEvent = useCallback(
		({ event, start, end }: EventInteractionArgs<Event>) => {
			const newStart = new Date(start);
			const newEnd = new Date(end);

			// 충돌 검사 (자기 자신은 제외)
			if (hasConflict(newStart, newEnd, myEvents, event.id)) {
				useGlobalToastStore
					.getState()
					.push({ message: '해당 시간에 이미 다른 일정이 있습니다.' });
				return;
			}

			setMyEvents(prev => {
				const existing = prev.find(ev => ev.id === event.id);
				if (!existing) return prev;
				const filtered = prev.filter(ev => ev.id !== event.id);
				return [
					...filtered,
					{
						...existing,
						start: newStart,
						end: newEnd
					}
				];
			});
		},
		[myEvents]
	);

	// const eventPropGetter = useCallback<EventPropGetter<Event>>(event => {
	// 	return {
	// 		...(event.isDraggable
	// 			? { className: 'isDraggable' }
	// 			: { className: 'nonDraggable' })
	// 	};
	// }, []);

	// const defaultDate = useMemo(() => new Date(2025, 11, 12), []);

	return (
		<div style={{ height: '80vh', userSelect: 'all' }} onMouseDown={handleMouseDown}>
			<DnDCalendar
				localizer={localizer}
				view={view}
				date={date}
				events={myEvents}
				backgroundEvents={backgroundEvents}
				// eventPropGetter={eventPropGetter}
				dayLayoutAlgorithm="no-overlap"
				allDayMaxRows={2}
				onView={setView}
				onNavigate={setDate}
				onSelectSlot={createEvent}
				onEventDrop={moveEvent}
				onEventResize={resizeEvent}
				resizable={true}
				selectable={true}
			/>
		</div>
	);
}
