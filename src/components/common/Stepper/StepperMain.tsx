import {
	useState,
	Children,
	isValidElement,
	cloneElement,
	type ReactElement
} from 'react';
import { StepperProvider } from './StepperProvider';
import styles from './Stepper.module.scss';
import StepperStep from './StepperStep';
import { classNames } from '../../../utils/classNames';

interface StepperMainProps {
	className?: string;
	activeStep?: number;
	defaultActiveStep?: number;
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
	defaultActiveStep,
	activeStep: controlledActiveStep,
	onChange,
	children
}: StepperMainProps) {
	const [unControlledActiveStep, setUnControlledActiveStep] = useState(
		defaultActiveStep ?? 0
	);

	const isControlled = controlledActiveStep != undefined;
	const activeStep = isControlled ? controlledActiveStep : unControlledActiveStep;
	const totalStep = Children.toArray(children).filter(
		child => isValidElement(child) && child.type === StepperStep
	).length;

	const setActiveStep = (value: number) => {
		if (!isControlled) setUnControlledActiveStep(value);
		onChange?.(value);
	};

	let count = 0;
	const childrenWithStep = Children.map(children, child => {
		if (isValidElement(child) && child.type === StepperStep) {
			count += 1;
			return cloneElement(child as ReactElement<StepProps>, { step: count });
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
