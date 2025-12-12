import { CSSTransition } from 'react-transition-group';
import { useRef } from 'react';
import { SideSheetProvider } from './SideSheetProvider';
import { classNames } from '../../../utils/classNames';
import styles from './SideSheet.module.scss';

interface SideSheetProps {
	className?: string;
	overlay?: boolean;
	open: boolean;
	direction?: 'left' | 'right';
	onChange?: (state: boolean) => void;
	children: React.ReactNode;
}

export default function SideSheetMain({
	className: classNameProp,
	open: isOpen,
	direction = 'left',
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
		styles[direction],
		overlay && styles.overlay,
		classNameProp
	);

	return (
		<SideSheetProvider value={{ isOpen, setIsOpen }}>
			<CSSTransition
				nodeRef={targetRef}
				in={isOpen}
				timeout={{ enter: 0, exit: 400 }}
				mountOnEnter
				unmountOnExit>
				<div className={className} ref={targetRef}>
					<div className={styles.container}>{children}</div>
				</div>
			</CSSTransition>
		</SideSheetProvider>
	);
}
