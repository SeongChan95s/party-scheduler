import { BottomSheet } from '@/components/common/BottomSheet';
import type { BottomSheetState } from '@/components/common/BottomSheet/BottomSheet';
import { IconClose } from '@/components/common/Icon';
import { IconButton } from '@/components/common/IconButton';
import { useState } from 'react';
import DatePicker, { type DatePickerProps } from 'react-datepicker';

interface DatePickerSheetProps {
	state: BottomSheetState;
	selected?: Date;
	onStateChange?: (value: BottomSheetState) => void;
	rest?: DatePickerProps;
}

type OnChangeType =
	| {
			selectsRange?: never;
			selectsMultiple?: never;
			onChange?: (
				date: Date | null,
				event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
			) => void;
	  }
	| {
			selectsRange: true;
			selectsMultiple?: never;
			onChange?: (
				date: [Date | null, Date | null],
				event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
			) => void;
	  }
	| {
			selectsRange?: never;
			selectsMultiple: true;
			onChange?: (
				date: Date[] | null,
				event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
			) => void;
	  };

const renderMonthContent = (
	month: number,
	shortMonth: string,
	longMonth: string,
	day: Date
): React.ReactNode => {
	const fullYear = new Date(day).getFullYear();
	const tooltipText = `Tooltip for month: ${longMonth} ${fullYear}`;

	return <span title={tooltipText}>{shortMonth}</span>;
};

export default function DatePickerSheet({
	state,
	selected,
	onStateChange,
	...rest
}: DatePickerSheetProps & OnChangeType) {
	const [view, setView] = useState<'calendar' | 'monthYear'>('calendar');

	return (
		<BottomSheet
			state={state}
			onChange={value => {
				onStateChange?.(value);
			}}>
			<div className="inner ios-safe-pb">
				<IconButton
					className="absolute right-0 top-0"
					icon={<IconClose />}
					onClick={() => onStateChange?.('closed')}
				/>
				<DatePicker
					{...rest}
					selected={selected}
					inline
					showMonthYearPicker={view == 'monthYear'}
					renderMonthContent={renderMonthContent}
				/>
			</div>
		</BottomSheet>
	);
}
