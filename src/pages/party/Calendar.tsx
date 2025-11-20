import MyCalendar from '@/components/party/MyCalendar';

export default function Calendar() {
	return (
		<div className="fixed top-48 left-0 right-0 bottom-0">
			<MyCalendar partyId="demo-party" />
		</div>
	);
}
