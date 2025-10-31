'use client';

import { Button } from '../Button';
import { useDialog } from './Dialog.hooks';

interface DialogCloseButtonProps {
	className?: string;
	children?: React.ReactNode;
}

export default function DialogCloseButton({
	className,
	children
}: DialogCloseButtonProps) {
	const { setIsOpen } = useDialog();

	return (
		<Button className={className} variant="outlined" onClick={() => setIsOpen(false)}>
			{children}
		</Button>
	);
}
