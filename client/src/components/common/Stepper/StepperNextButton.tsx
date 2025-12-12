import { classNames } from '../../../utils/classNames';
import { useStepper } from './Stepper.hooks';
import styles from './Stepper.module.scss';

interface Props {
	className?: string;
	onClick?: (e: React.MouseEvent) => void;
	children?: React.ReactNode;
}

export default function StepperNextButton({
	className: classNameProp,
	onClick,
	children
}: Props) {
	const { activeStep, setActiveStep, totalStep } = useStepper();

	const handleClickNext = (e: React.MouseEvent) => {
		e.preventDefault();

		if (totalStep > activeStep) setActiveStep(activeStep + 1);
		onClick?.(e);
	};

	const isMaxStep = activeStep == totalStep;
	const className = classNames(
		styles.nextButton,
		isMaxStep && 'max-step',
		'stepper-next-button',
		classNameProp
	);

	return (
		<button className={className} type="button" onClick={handleClickNext}>
			{children}
		</button>
	);
}
