import { useContext } from 'react';
import { MenuContext } from './MenuProvider';

export const useMenu = () => {
	const context = useContext(MenuContext);
	if (!context) throw new Error('useMenu must be use within context provider');
	return context;
};
