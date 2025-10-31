'use client';

import { CSSTransition } from 'react-transition-group';
import { useRef } from 'react';
import { SideSheetProvider } from './SideSheetProvider';
import SideSheetCloseButton from './SideSheetCloseButton';
import styles from './SideSheet.module.scss';
import { createTransitionClassNames } from '@/app/utils/convert';
import { classNames } from '@/app/utils';

interface SideSheetProps {
	className?: string;
	overlay?: boolean;
	open: boolean;
	onChange?: (state: boolean) => void;
	children: React.ReactNode;
}

export default function SideSheetMain({
	className: classNameProp,
	open: isOpen,
	onChange,
	overlay,
	children
}: SideSheetProps) {
	const targetRef = useRef<HTMLDivElement>(null);

	const setIsOpen = (value: boolean) => {
		onChange?.(value);
	};

	const className = classNames(
		styles.sideSheet,
		overlay && styles.overlay,
		classNameProp
	);

	return (
		<SideSheetProvider value={{ isOpen, setIsOpen }}>
			<CSSTransition
				nodeRef={targetRef}
				in={isOpen}
				timeout={{ enter: 0, exit: 400 }}
				classNames={createTransitionClassNames()}
				mountOnEnter
				unmountOnExit>
				<>
					<div className={className} ref={targetRef}>
						<div className={styles.container}>
							{children}
							<SideSheetCloseButton className={styles.closeButton} />
						</div>
					</div>
				</>
			</CSSTransition>
		</SideSheetProvider>
	);
}
