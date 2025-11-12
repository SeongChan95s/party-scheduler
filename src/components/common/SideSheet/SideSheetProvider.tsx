import { createContext } from 'react';

export interface SideSheetStore {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
}

export const SideSheetContext = createContext<SideSheetStore | null>(null);

function SideSheetProvider({
	value,
	children
}: {
	value: SideSheetStore;
	children: React.ReactNode;
}) {
	return <SideSheetContext.Provider value={value}>{children}</SideSheetContext.Provider>;
}

export { SideSheetProvider };
