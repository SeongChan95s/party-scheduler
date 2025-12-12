import { createContext } from 'react';

export interface SelectStore {
	name?: string;
	variant: 'outlined' | 'dynamic' | 'filled';
	inputRef?: React.RefObject<HTMLInputElement> | undefined;
	size: 'xs' | 'sm' | 'md' | 'lg';
	value: string;
	setValue: (value: string) => void;
	isFocused: boolean;
	setIsFocused: (value: boolean) => void;
	isEntered: boolean;
	setIsEntered: (value: boolean) => void;
	enableTextField?: boolean;
	setEnableTextField?: (value: boolean) => void;
}

export const SelectContext = createContext<SelectStore | null>(null);

export function SelectProvider({
	value,
	children
}: {
	value: SelectStore;
	children: React.ReactNode;
}) {
	return <SelectContext.Provider value={value}>{children}</SelectContext.Provider>;
}
