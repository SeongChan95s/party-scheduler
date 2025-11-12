import { classNames } from '../../../utils/classNames';
import { useCounter } from './Counter.hooks';
import styles from './Counter.module.scss';

interface CounterDecreaseProps {
	className?: string;
	onClick?: React.MouseEventHandler;
	children: React.ReactNode;
}

export default function CounterDecrease({
	className: classNameProp,
	onClick,
	children
}: CounterDecreaseProps) {
	const { value, setValue, min, step } = useCounter();

	const handleDecrease = (e: React.MouseEvent) => {
		const next = value - step;
		if (min) {
			if (next > min) {
				setValue(next);
			} else if (next < min) {
				setValue(min);
			}
		} else {
			setValue(next);
		}

		if (onClick) onClick(e);
	};

	const className = classNames(styles.button, 'counter-decrease', classNameProp);

	return (
		<button className={className} onClick={handleDecrease} type="button">
			{children}
		</button>
	);
}
