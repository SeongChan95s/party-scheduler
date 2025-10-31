'use client';

import { IconClose } from '../Icon';
import { useSideSheet } from './useSideSheet';

interface SideSheetCloseButtonProps {
	className?: string;
	children?: React.ReactNode;
}

export default function SideSheetCloseButton({
	className,
	children
}: SideSheetCloseButtonProps) {
	const { setIsOpen } = useSideSheet();

	return (
		<button className={className} onClick={() => setIsOpen(false)}>
			{children ?? <IconClose />}
		</button>
	);
}
