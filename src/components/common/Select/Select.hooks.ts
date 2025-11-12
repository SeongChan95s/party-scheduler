import { useContext } from 'react';
import { SelectContext } from './SelectProvider';

export const useSelect = () => {
	const context = useContext(SelectContext);
	if (!context) throw new Error('useSelect must be use within context provider');
	return context;
};
