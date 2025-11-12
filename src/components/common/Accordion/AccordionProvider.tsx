import { createContext } from 'react';

export interface AccordionStore {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
}

export const AccordionContext = createContext<AccordionStore | null>(null);

function AccordionProvider({
	value,
	children
}: {
	value: AccordionStore;
	children: React.ReactNode;
}) {
	return <AccordionContext.Provider value={value}>{children}</AccordionContext.Provider>;
}

export { AccordionProvider };
