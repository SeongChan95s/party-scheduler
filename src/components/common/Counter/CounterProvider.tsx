import { createContext } from 'react';

export interface CounterStore {
	value: number;
	setValue: (value: number) => void;
	min?: number;
	max?: number;
	step: number;
}

export const CounterContext = createContext<CounterStore | null>(null);

function CounterProvider({
	value,
	children
}: {
	value: CounterStore;
	children: React.ReactNode;
}) {
	return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
}

export { CounterProvider };
