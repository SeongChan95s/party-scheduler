import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './Overlay.module.scss';

interface OverlayProps {
	open: boolean;
	className?: string;
}

export default function Overlay({ open = false, className = '' }: OverlayProps) {
	const targetRef = useRef(null);

	return (
		<CSSTransition
			nodeRef={targetRef}
			in={open}
			classNames={styles.overlay}
			timeout={{ enter: 400, exit: 400 }}
			mountOnEnter
			unmountOnExit>
			<div className={`${styles.overlay} overlay ${className}`} ref={targetRef}></div>
		</CSSTransition>
	);
}
