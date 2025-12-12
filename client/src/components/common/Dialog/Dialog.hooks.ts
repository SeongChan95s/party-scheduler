import { DialogContext } from './DialogProvider';
import { useContext } from 'react';

function useDialog() {
	const context = useContext(DialogContext);
	if (!context) throw new Error('useDialog must be use within context provider');
	return context;
}

export { useDialog };
