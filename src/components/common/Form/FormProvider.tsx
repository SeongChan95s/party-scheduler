'use client';

import { createContext } from 'react';
import { StoreApi } from 'zustand';
import { FormStore } from './useForm';

export const FormContext = createContext<StoreApi<FormStore> | null>(null);

function FormProvider({
	store,
	children
}: {
	store: StoreApi<FormStore>;
	children: React.ReactNode;
}) {
	return <FormContext.Provider value={store}>{children}</FormContext.Provider>;
}

export { FormProvider };
