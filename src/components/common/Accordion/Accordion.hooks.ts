import { useContext } from 'react';
import { AccordionContext } from './AccordionProvider';

export const useAccordion = () => {
	const context = useContext(AccordionContext);
	if (!context) throw new Error('useAccordion must be use within context provider');
	return context;
};
