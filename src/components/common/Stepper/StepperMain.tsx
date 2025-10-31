'use client';

import { useState, Children, isValidElement, cloneElement, ReactElement } from 'react';
import { StepperProvider } from './StepperProvider';
import { classNames } from '@/app/utils';
import styles from './Stepper.module.scss';
import StepperStep from './StepperStep';

interface StepperMainProps {
	className?: string;
	activeStep?: number;
	name?: string;
	onChange?: (value: number) => void;
	direction?: 'horizontal' | 'vertical';
	children: React.ReactNode;
}

interface StepProps {
	step: number;
	className?: string;
	children?: React.ReactNode;
}

export default function StepperMain({
	className: classNameProp,
	direction = 'vertical',
	name,
	activeStep: controlledActiveStep,
	onChange,
	children
}: StepperMainProps) {
	const [unControlledActiveStep, setUnControlledActiveStep] = useState(1);

	const isControlled = controlledActiveStep != undefined;
	const activeStep = isControlled ? controlledActiveStep : unControlledActiveStep;
	const totalStep = Children.toArray(children).filter(
		child => isValidElement(child) && child.type === StepperStep
	).length;

	const setActiveStep = (value: number) => {
		if (!isControlled) setUnControlledActiveStep(value);
		onChange?.(value);
	};

	const childrenWithStep = Children.map(children, (child, index) => {
		if (isValidElement(child) && child.type === StepperStep) {
			return cloneElement(child as ReactElement<StepProps>, { step: index + 1 });
		}
		return child;
	});

	const className = classNames(styles.stepper, styles[direction], classNameProp);

	return (
		<StepperProvider value={{ activeStep, setActiveStep, totalStep }}>
			<div className={className}>{childrenWithStep}</div>
			<input type="hidden" name={name} value={activeStep} />
		</StepperProvider>
	);
}
