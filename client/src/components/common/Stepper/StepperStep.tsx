import styles from './Stepper.module.scss';
import { useStepper } from './Stepper.hooks';
import { classNames } from '../../../utils/classNames';

interface Props {
	step?: number;
	className?: string;
	onClick?: React.MouseEventHandler;
	children?: React.ReactNode;
}

export default function StepperStep({
	className: classNameProp,
	step = 1,
	onClick,
	children
}: Props) {
	const { activeStep, totalStep } = useStepper();
	const isCompleted = activeStep > step && !(activeStep > totalStep);
	const isActive = activeStep == step;
	const isFinished = activeStep > totalStep;

	const className = classNames(
		styles.step,
		isCompleted && 'completed',
		isActive && 'active',
		isFinished && 'finished',
		classNameProp
	);

	return (
		<div className={className} onClick={onClick}>
			<div className={`${styles.container} stepper-step-container`}>
				<span className={styles.label}>{step}</span>
				{children && <div className={`${styles.body} stepper-step-body`}>{children}</div>}
			</div>
		</div>
	);
}
