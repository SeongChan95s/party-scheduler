import { createContext, useRef } from 'react';
import { createStore, type StoreApi } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import useInitStore from '../../../hooks/useInitStore';

export const TabContext = createContext<StoreApi<TabStore> | null>(null);

type Tab = {
	width: number;
	left: number;
};

type Transition = {
	className: string;
	timeout: number | { enter: number; exit: number };
};

export interface TabStore {
	tab: Tab;
	setTab: (value: Partial<Tab>) => void;
	activeTabKey: string;
	setActiveTabKey: (value: string) => void;
	prevTabKey: string;
	setPrevTabKey: (value: string) => void;
	transition?: Transition;
	setTransition: (value: Transition) => void;
}

interface UseCreateTabStore {
	defaultKey: string;
	transition?: Transition;
}

function useCreateTabStore({ defaultKey, transition }: UseCreateTabStore) {
	const createTabStore = createStore(
		subscribeWithSelector<TabStore>(set => ({
			tab: {
				width: 0,
				height: 0,
				left: 0
			},
			setTab: value => set(store => ({ tab: { ...store.tab, ...value } })),
			activeTabKey: defaultKey,
			setActiveTabKey: value => set({ activeTabKey: value }),
			prevTabKey: '0',
			setPrevTabKey: value => set({ prevTabKey: value }),
			transition,
			setTransition: value => set({ transition: value })
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
