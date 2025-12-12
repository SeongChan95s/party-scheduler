import SelectCalendar from '@/components/party/SelectCalendar';

export default function SelectSchedulePage() {
	return (
		<div className="fixed top-48 left-0 right-0 layout-width h-[calc(100vh-48px)]">
			<SelectCalendar partyId="demo-party" planId="demo-plan" />
		</div>
	);
}
