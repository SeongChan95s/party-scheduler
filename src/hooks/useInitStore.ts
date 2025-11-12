import { useContext } from 'react';
import { useStore, type StoreApi } from 'zustand';

export default function useInitStore<T, U = T>(
	store: React.Context<StoreApi<T> | null>,
	selector: (state: T) => U
) {
	const storeContext = useContext(store);

	if (!storeContext) {
		// return undefined;
		throw new Error('useInitStore must be use within useInitStoreContextProvider');
	}
	return useStore(storeContext, selector);
}
