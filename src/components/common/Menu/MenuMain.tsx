'use client';

import { useState } from 'react';
import { useClickOutside } from '@/app/hooks';
import { MenuProvider } from './MenuProvider';
import styles from './Menu.module.scss';

interface MenuMainProps {
	open?: boolean;
	className?: string;
	onChange?: (open: boolean) => void;
	children: React.ReactNode;
}

export default function MenuMain({
	className = '',
	open: controlledOpen,
	onChange,
	children
}: MenuMainProps) {
	const [open, setOpen] = useState(false);

	const isControlled = controlledOpen != undefined;
	const isOpen = isControlled ? controlledOpen : open;

	const setIsOpen = (value: boolean) => {
		if (!isControlled) setOpen(value);
		onChange?.(value);
	};

	const [target] = useClickOutside<HTMLDivElement>(isOpen, setIsOpen);

	return (
		<MenuProvider value={{ isOpen, setIsOpen }}>
			<div className={`${styles.menu} ${className}`} ref={target}>
				{children}
			</div>
		</MenuProvider>
	);
}
