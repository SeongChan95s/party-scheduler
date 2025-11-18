import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCallback, useMemo, useState } from 'react';

const DnDCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const events = [
	{
		id: 0,
		title: 'All Day Event very long title',
		allDay: true,
		start: new Date('2025-11-18'),
		end: new Date('2025-11-19')
	}
];

export default function MyCalendar() {
	const [myEvents, setMyEvents] = useState(events);

	const moveEvent = useCallback(
		({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
			const { allDay } = event;
			if (!allDay && droppedOnAllDaySlot) {
				event.allDay = true;
			}
			if (allDay && !droppedOnAllDaySlot) {
				event.allDay = false;
			}

			setMyEvents(prev => {
				const existing = prev.find(ev => ev.id === event.id) ?? {};
				const filtered = prev.filter(ev => ev.id !== event.id);
				return [...filtered, { ...existing, start, end, allDay: event.allDay }];
			});
		},
		[setMyEvents]
	);

	const resizeEvent = useCallback(
		({ event, start, end }) => {
			setMyEvents(prev => {
				const existing = prev.find(ev => ev.id === event.id) ?? {};
				const filtered = prev.filter(ev => ev.id !== event.id);
				return [...filtered, { ...existing, start, end }];
			});
		},
		[setMyEvents]
	);

	// const defaultDate = useMemo(() => new Date(2025, 11, 12), []);

	return (
		<div style={{ height: '100vh' }}>
			<DnDCalendar
				localizer={localizer}
				events={myEvents}
				draggableAccessor={event => true}
				onEventDrop={moveEvent}
				onEventResize={resizeEvent}
			/>
		</div>
	);
}
