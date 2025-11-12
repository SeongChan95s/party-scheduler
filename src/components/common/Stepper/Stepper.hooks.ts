import { useContext } from 'react';
import { StepperContext } from './StepperProvider';

export const useStepper = () => {
	const context = useContext(StepperContext);
	if (!context) throw new Error('useStepper must be use within context provider');
	return context;
};
