import { classNames } from '../../../utils/classNames';
import { useStepper } from './Stepper.hooks';
import styles from './Stepper.module.scss';

interface Props {
	className?: string;
	onClick?: (e: React.MouseEvent) => void;
	children?: React.ReactNode;
}

export default function StepperPrevButton({
	className: classNameProp,
	onClick,
	children
}: Props) {
	const { activeStep, setActiveStep } = useStepper();

	const handleClickPrev = (e: React.MouseEvent) => {
		e.preventDefault();

		if (0 < activeStep) setActiveStep(activeStep - 1);
		onClick?.(e);
	};
	const isMinStep = activeStep == 1;
	const className = classNames(
		styles.prevButton,
		isMinStep && 'min-step',
		'stepper-prev-button',
		classNameProp
	);

	return (
		<button className={className} type="button" onClick={handleClickPrev}>
			{children}
		</button>
	);
}
