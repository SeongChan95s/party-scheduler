import { classNames } from '../../../utils/classNames';
import { useCounter } from './Counter.hooks';
import styles from './Counter.module.scss';

interface CounterCountProps {
	className?: string;
}

export default function CounterCount({ className: classNameProp }: CounterCountProps) {
	const { value } = useCounter();

	const className = classNames(styles.count, 'counter-count', classNameProp);

	return <div className={className}>{value}</div>;
}
