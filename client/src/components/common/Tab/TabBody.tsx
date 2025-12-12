import { useTabStore } from './TabProvider';
import { useRef, useMemo } from 'react';
import styles from './Tab.module.scss';
import React from 'react';

interface TabBodyProps {
	className?: string;
	children: React.ReactNode;
}

export default function TabBody({ className, children }: TabBodyProps) {
	const activeTabKey = useTabStore(state => state.activeTabKey);
	const prevTabKey = useTabStore(state => state.prevTabKey);

	const direction = useMemo(() => {
		const childrenArray = React.Children.toArray(children);
		let activeIndex = -1;
		let prevIndex = -1;

		childrenArray.forEach((child, index) => {
			if (
				React.isValidElement(child) &&
				child.props &&
				typeof child.props === 'object' &&
				'eventKey' in child.props
			) {
				const eventKey = (child.props as { eventKey: string }).eventKey;
				if (eventKey === activeTabKey) {
					activeIndex = index;
				}
				if (eventKey === prevTabKey) {
					prevIndex = index;
				}
			}
		});

		return activeIndex > prevIndex ? 'next' : 'prev';
	}, [activeTabKey, prevTabKey, children]);

	const targetRef = useRef<HTMLDivElement>(null);

	return (
		<div className={`${styles.tabBody} ${direction} ${className ?? ''}`} ref={targetRef}>
			{children}
		</div>
	);
}
