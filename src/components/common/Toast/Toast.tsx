import { CSSTransition } from 'react-transition-group';
import { IconClose } from '../Icon';
import { useRef, useState } from 'react';
import { Collapse } from '../Collapse';
import styles from './Toast.module.scss';

interface ToastMainProps {
	className?: string;
	visible: boolean;
	button?: React.ReactNode;
	onChange?: (value: boolean) => void;
	timeout?: number | { enter: number; exit: number };
	onClick?: (e: React.MouseEvent) => void;
	children: React.ReactNode;
}

export default function ToastMain({
	className = '',
	visible,
	onChange,
	timeout = 500,
	button,
	onClick,
	children
}: ToastMainProps) {
	const targetRef = useRef(null);
	const [isWrap, setIsWrap] = useState(false);

	const handleClick = (e: React.MouseEvent) => {
		setIsWrap(!isWrap);
		if (onClick) onClick(e);
	};

	return (
		<CSSTransition
			nodeRef={targetRef}
			timeout={timeout}
			in={visible}
			classNames="appear-up"
			onEntered={() => {
				const timer = setTimeout(() => {
					onChange?.(false);
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
					<Collapse className={styles.contents} line={2} wrap={isWrap}>
						{children}
					</Collapse>
					<div className={styles.buttonWrap}>
						{button}
						<button
							className={styles.closeButton}
							onClick={e => {
								e.stopPropagation();
								onChange?.(false);
							}}>
							<IconClose className={styles.closeButton} />
						</button>
					</div>
				</div>
			</div>
		</CSSTransition>
	);
}
