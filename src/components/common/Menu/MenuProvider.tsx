import { createContext } from 'react';

export interface MenuStore {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
}

export const MenuContext = createContext<MenuStore | null>(null);

function MenuProvider({
	value,
	children
}: {
	value: MenuStore;
	children: React.ReactNode;
}) {
	return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export { MenuProvider };
