import { createContext } from 'react';

export interface StepperStore {
	activeStep: number;
	setActiveStep: (value: number) => void;
	totalStep: number;
}

export const StepperContext = createContext<StepperStore | null>(null);

function StepperProvider({
	value,
	children
}: {
	value: StepperStore;
	children: React.ReactNode;
}) {
	return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>;
}

export { StepperProvider };
