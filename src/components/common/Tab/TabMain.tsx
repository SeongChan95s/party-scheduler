'use client';

import { useStore } from 'zustand';
import { TabProvider, useCreateTabStore } from './TabProvider';
import styles from './Tab.module.scss';
import { classNames } from '@/app/utils';
import { createTransitionClassNames } from '@/app/utils/convert';

interface TabProps {
	className?: string;
	defaultKey: string;
	direction?: 'horizontal' | 'vertical';
	timeout?: number | { enter: number; exit: number };
	transitionClassName?:
		| string
		| {
				enter: string;
				enterActive: string;
				enterDone: string;
				exit: string;
				exitActive: string;
				exitDone: string;
		  };
	children?: React.ReactNode;
}

export default function TabMain({
	className,
	defaultKey,
	direction = 'horizontal',
	timeout = { enter: 300, exit: 0 },
	transitionClassName = createTransitionClassNames('fade'),
	children
}: TabProps) {
	const storeRef = useCreateTabStore({ defaultKey, timeout, transitionClassName });
	const setPrevTabKey = useStore(storeRef, state => state.setPrevTabKey);

	storeRef.subscribe(
		state => state.activeTabKey,
		(cur, prev) => {
			setPrevTabKey(prev);
		}
	);

	return (
		<TabProvider storeRef={storeRef}>
			<div className={classNames(styles[direction], className)}>{children}</div>
		</TabProvider>
	);
}
