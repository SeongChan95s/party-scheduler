import { CounterProvider, CounterStore } from './CounterProvider';
import { useState } from 'react';
import { classNames } from '@/app/utils';
import styles from './Counter.module.scss';

interface CounterMainProps extends Partial<CounterStore> {
	name?: string;
	variant?: 'block';
	size?: 'sm' | 'md';
	className?: string;
	defaultValue?: number;
	onChange?: (value: number) => void;
	children: React.ReactNode;
}

export default function CounterMain({
	className,
	size = 'md',
	variant = 'block',
	name,
	defaultValue = 1,
	value: controlledValue,
	onChange,
	min,
	max,
	step = 1,
	children
}: CounterMainProps) {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

	const isControlled = controlledValue != undefined;
	const value = isControlled ? controlledValue : uncontrolledValue;

	const setValue = (value: number) => {
		if (!isControlled) setUncontrolledValue(value);
		onChange?.(value);
	};

	const counterMainClassName = classNames(
		styles.counter,
		styles[size],
		styles[variant],
		'counter',
		className
	);

	return (
		<CounterProvider value={{ value, setValue, min, max, step }}>
			<div className={counterMainClassName}>
				{children}
				<input type="hidden" value={value} name={name} />
			</div>
		</CounterProvider>
	);
}
