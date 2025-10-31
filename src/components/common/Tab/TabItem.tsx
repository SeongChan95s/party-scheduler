'use client';

import { CSSTransition } from 'react-transition-group';
import { useTabStore } from './TabProvider';
import { useRef } from 'react';
import { classNames } from '@/app/utils';
import styles from './Tab.module.scss';

interface TabItemProps {
	className?: string;
	eventKey: string;
	children: React.ReactNode;
}

export default function TabItem({
	className: classNameProp,
	eventKey,
	children
}: TabItemProps) {
	const tab = useTabStore(state => state.tab);
	const activeTabKey = useTabStore(state => state.activeTabKey);
	const targetRef = useRef<HTMLDivElement>(null);
	const className = classNames(styles.tabItem, classNameProp);

	return (
		<CSSTransition
			nodeRef={targetRef}
			in={activeTabKey == eventKey}
			timeout={tab.timeout}
			classNames={tab.transitionClassName}
			mountOnEnter
			unmountOnExit>
			<div className={className} ref={targetRef}>
				{children}
			</div>
		</CSSTransition>
	);
}
