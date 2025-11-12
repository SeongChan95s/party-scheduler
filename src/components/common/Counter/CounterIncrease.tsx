import { classNames } from '../../../utils/classNames';
import { useCounter } from './Counter.hooks';
import styles from './Counter.module.scss';

interface CounterIncreaseProps {
	className?: string;
	onClick?: React.MouseEventHandler;
	children: React.ReactNode;
}

export default function CounterIncrease({
	className: classNameProp,
	onClick,
	children
}: CounterIncreaseProps) {
	const { value, setValue, max, step } = useCounter();

	const handleIncrease = (e: React.MouseEvent) => {
		const next = value + step;
		if (max) {
			if (next < max) {
				setValue(next);
			} else if (next > max) {
				setValue(max);
			}
		} else {
			setValue(next);
		}

		if (onClick) onClick(e);
	};

	const className = classNames(styles.button, 'counter-increase', classNameProp);

	return (
		<button className={className} onClick={handleIncrease} type="button">
			{children}
		</button>
	);
}
