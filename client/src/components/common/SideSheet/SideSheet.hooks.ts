import { SideSheetContext } from './SideSheetProvider';
import { useContext } from 'react';

export interface SideSheetStore {
	isOpen: boolean;
	setIsOpen: (state: boolean) => void;
}

function useSideSheet() {
	const context = useContext(SideSheetContext);
	if (!context) throw new Error('useSideSheet must be use within context provider');
	return context;
}

export { useSideSheet };
