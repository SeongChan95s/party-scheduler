import { useTabStore } from './TabProvider';
import { useEffect, useRef } from 'react';
import styles from './Tab.module.scss';

interface TabPaneProps {
	className?: string;
	eventKey: string;
	onClick?: (e: React.MouseEvent) => void;
	children: React.ReactNode;
}

export default function TabPane({
	className,
	eventKey,
	onClick: handleClick,
	children
}: TabPaneProps) {
	const activeTabKey = useTabStore(state => state.activeTabKey);
	const setTab = useTabStore(state => state.setTab);
	const setActiveTabKey = useTabStore(state => state.setActiveTabKey);
	const activeClass = activeTabKey == eventKey ? 'active' : '';
	const targetRef = useRef<HTMLDivElement>(null);

	const onClick = (e: React.MouseEvent) => {
		setActiveTabKey(eventKey);
		if (handleClick) handleClick(e);
	};

	useEffect(() => {
		if (activeTabKey == eventKey) {
			const left = targetRef?.current?.offsetLeft ?? 0;
			const width = targetRef?.current?.offsetWidth ?? 0;
			setTab({ left, width });
		}
	}, [activeTabKey]);

	return (
		<div
			className={`${styles.tabPane} ${activeClass} ${className}`}
			ref={targetRef}
			onClick={onClick}>
			{children}
		</div>
	);
}
