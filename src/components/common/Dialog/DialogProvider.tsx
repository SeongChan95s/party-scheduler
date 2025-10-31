'use client';

import { createContext } from 'react';

export interface DialogStore {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
}

export const DialogContext = createContext<DialogStore | null>(null);

function DialogProvider({
	value,
	children
}: {
	value: DialogStore;
	children: React.ReactNode;
}) {
	return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export { DialogProvider };
