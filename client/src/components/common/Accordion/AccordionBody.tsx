import { CSSTransition } from 'react-transition-group';
import { useAccordion } from './Accordion.hooks';
import { useEffect, useRef, useState } from 'react';
import styles from './Accordion.module.scss';

interface AccordionBodyProps {
	className?: string;
	children?: React.ReactNode;
}

export default function AccordionBody({ className = '', children }: AccordionBodyProps) {
	const { isOpen } = useAccordion();
	const targetRef = useRef<HTMLDivElement>(null);
	const [maxHeight, setMaxHeight] = useState(0);
	const cssHeightProperty = { '--max-height': maxHeight + 'px' } as React.CSSProperties;

	useEffect(() => {
		if (!targetRef.current) return;

		if (isOpen) {
			setMaxHeight(targetRef.current.scrollHeight);
		} else {
			setMaxHeight(0);
		}
	}, [isOpen]);

	return (
		<CSSTransition
			in={isOpen}
			nodeRef={targetRef}
			timeout={350}
			mountOnEnter
			unmountOnExit>
			<div
				className={`${styles.body} accordion-body ${className}`}
				ref={targetRef}
				style={cssHeightProperty}>
				<div className={`accordion-body-container`}>{children}</div>
			</div>
		</CSSTransition>
	);
}
