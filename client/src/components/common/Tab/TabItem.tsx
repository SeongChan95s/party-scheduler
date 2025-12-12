import { CSSTransition } from 'react-transition-group';
import { useTabStore } from './TabProvider';
import { useRef } from 'react';
import styles from './Tab.module.scss';
import { classNames } from '../../../utils/classNames';

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
	const activeTabKey = useTabStore(state => state.activeTabKey);
	const targetRef = useRef<HTMLDivElement>(null);
	const transition = useTabStore(state => state.transition);
	const className = classNames(styles.tabItem, classNameProp);

	if (transition)
		return (
			<CSSTransition
				nodeRef={targetRef}
				in={activeTabKey == eventKey}
				timeout={transition.timeout}
				classNames={transition.className}
				mountOnEnter
				unmountOnExit>
				<div className={className} ref={targetRef}>
					{children}
				</div>
			</CSSTransition>
		);

	if (!transition && activeTabKey == eventKey)
		return <div className={className}>{children}</div>;
}
