'use client';

import { CSSTransition } from 'react-transition-group';
import { IconAlertFilled, IconClose } from '../Icon';
import { useEffect, useRef, useState } from 'react';
import { Collapse } from '../Collapse';
import styles from './Toast.module.scss';
import { createTransitionClassNames } from '@/app/utils/convert';

interface ToastMainProps {
	icon?: React.ReactNode;
	button?: React.ReactNode;
	className?: string;
	isVisible: boolean;
	timeout?: number | { enter: number; exit: number };
	onClick?: (e: React.MouseEvent) => void;
	children: React.ReactNode;
}

export default function ToastMain({
	className = '',
	icon = <IconAlertFilled />,
	button,
	isVisible: isVisibleProp,
	timeout = 500,
	onClick,
	children
}: ToastMainProps) {
	const targetRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	const [isWrap, setIsWrap] = useState(false);

	useEffect(() => {
		setIsVisible(isVisibleProp);
	}, [isVisibleProp]);

	const handleClick = (e: React.MouseEvent) => {
		setIsWrap(!isWrap);
		if (onClick) onClick(e);
	};

	return (
		<CSSTransition
			nodeRef={targetRef}
			timeout={timeout}
			in={isVisible}
			classNames={createTransitionClassNames('appearUp')}
			onEntered={() => {
				const timer = setTimeout(() => {
					setIsVisible(false);
					clearTimeout(timer);
				}, 6000);
			}}
			mountOnEnter
			unmountOnExit>
			<div
				className={`${styles.toast} ${className}`}
				ref={targetRef}
				onClick={handleClick}>
				<div className={styles.container}>
					{icon}
					<Collapse className={styles.contents} line={1} wrap={isWrap}>
						{children}
					</Collapse>
					<div className={styles.buttonWrap}>
						{button}
						<button
							className={styles.closeButton}
							onClick={e => {
								e.stopPropagation();
								if (setIsVisible) setIsVisible(false);
							}}>
							<IconClose className={styles.closeButton} />
						</button>
					</div>
				</div>
			</div>
		</CSSTransition>
	);
}
