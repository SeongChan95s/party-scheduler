'use client';

import { useInitStore } from '@/app/hooks';
import { createContext, useRef } from 'react';
import { createStore, StoreApi } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const TabContext = createContext<StoreApi<TabStore> | null>(null);

type Tab = {
	width: number;
	left: number;
	timeout: number | { enter: number; exit: number };
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
};

export interface TabStore {
	tab: Tab;
	setTab: (value: Partial<Tab>) => void;
	activeTabKey: string;
	setActiveTabKey: (value: string) => void;
	prevTabKey: string;
	setPrevTabKey: (value: string) => void;
}

interface UseCreateTabStore {
	defaultKey: string;
	timeout: number | { enter: number; exit: number };
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
}

function useCreateTabStore({
	defaultKey,
	timeout,
	transitionClassName
}: UseCreateTabStore) {
	const createTabStore = createStore(
		subscribeWithSelector<TabStore>(set => ({
			tab: {
				width: 0,
				height: 0,
				left: 0,
				timeout,
				transitionClassName
			},
			setTab: value => set(store => ({ tab: { ...store.tab, ...value } })),
			activeTabKey: defaultKey,
			setActiveTabKey: value => set({ activeTabKey: value }),
			prevTabKey: '0',
			setPrevTabKey: value => set({ prevTabKey: value })
		}))
	);
	const store = useRef(createTabStore).current;

	return store;
}

function useTabStore<U = TabStore>(selector: (state: TabStore) => U) {
	return useInitStore(TabContext, selector);
}

function TabProvider({
	storeRef,
	children
}: {
	storeRef: StoreApi<TabStore>;
	children: React.ReactNode;
}) {
	return <TabContext.Provider value={storeRef}>{children}</TabContext.Provider>;
}

export { useCreateTabStore, useTabStore, TabProvider };
