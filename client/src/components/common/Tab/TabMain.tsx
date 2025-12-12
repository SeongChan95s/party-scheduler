import { useStore } from 'zustand';
import { TabProvider, useCreateTabStore } from './TabProvider';
import styles from './Tab.module.scss';
import { classNames } from '../../../utils/classNames';

interface TabProps {
	className?: string;
	defaultKey: string;
	direction?: 'horizontal' | 'vertical';
	transition?: {
		className: string;
		timeout: number | { enter: number; exit: number };
	};
	children?: React.ReactNode;
}

export default function TabMain({
	className,
	defaultKey,
	direction = 'horizontal',
	transition,
	children
}: TabProps) {
	const storeRef = useCreateTabStore({ defaultKey, transition });
	const setPrevTabKey = useStore(storeRef, state => state.setPrevTabKey);

	storeRef.subscribe(
		state => state.activeTabKey,
		(_cur, prev) => {
			setPrevTabKey(prev);
		}
	);

	return (
		<TabProvider storeRef={storeRef}>
			<div className={classNames(styles[direction], className)}>{children}</div>
		</TabProvider>
	);
}
