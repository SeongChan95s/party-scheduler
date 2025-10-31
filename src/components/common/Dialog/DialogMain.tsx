'use client';

import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { DialogProvider } from './DialogProvider';
import { classNames } from '@/app/utils';
import styles from './Dialog.module.scss';
import { createTransitionClassNames } from '@/app/utils/convert';

interface DialogMainProps {
	className?: string;
	overlay?: boolean;
	open: boolean;
	onChange?: (state: boolean) => void;
	children: React.ReactNode;
}

function DialogMain({
	className: classNameProp,
	overlay = false,
	open: isOpen,
	onChange,
	children
}: DialogMainProps) {
	const targetRef = useRef<HTMLDivElement>(null);

	const setIsOpen = (value: boolean) => {
		onChange?.(value);
	};

	const className = classNames(styles.dialog, overlay && styles.overlay, classNameProp);

	return (
		<DialogProvider value={{ isOpen, setIsOpen }}>
			<CSSTransition
				nodeRef={targetRef}
				in={isOpen}
				timeout={{ enter: 250, exit: 250 }}
				classNames={createTransitionClassNames()}
				mountOnEnter
				unmountOnExit>
				<div className={className} ref={targetRef}>
					<div className="dialogContainer">{children}</div>
				</div>
			</CSSTransition>
		</DialogProvider>
	);
}

export default DialogMain;
