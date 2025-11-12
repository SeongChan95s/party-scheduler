import { useContext } from 'react';
import { CounterContext } from './CounterProvider';

export const useCounter = () => {
	const context = useContext(CounterContext);
	if (!context) throw new Error('useCounter must be use within context provider');
	return context;
};
