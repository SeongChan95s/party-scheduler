'use client';

import { InputHTMLAttributes } from 'react';
import { IconCheck } from '../Icon';
import { classNames } from '@/app/utils';
import styles from './RadioButton.module.scss';

interface RadioButtonProps {
	id?: string;
	className?: string;
	name: string;
	value?: string;
	size?: 'sm' | 'md' | 'lg';
	shape?: 'rect' | 'rounded' | 'round';
	variant?: 'label' | 'filled' | 'outlined';
	disabled?: boolean;
	checked?: boolean;
	defaultChecked?: boolean;
	fill?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	children?: React.ReactNode;
	rest?: InputHTMLAttributes<HTMLInputElement>;
}

export default function RadioButton({
	id,
	className: classNameProp,
	name,
	value,
	size = 'md',
	shape = 'rounded',
	variant = 'label',
	checked,
	defaultChecked,
	disabled = false,
	fill = false,
	onChange,
	children,
	...rest
}: RadioButtonProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e);
	};

	const className = classNames(
		styles.radioButton,
		styles[size],
		styles[shape],
		styles[variant],
		checked && styles.checked,
		fill && styles.fill,
		'radioButton',
		classNameProp
	);

	return (
		<label className={className} htmlFor={id}>
			{variant == 'label' && (
				<div className={styles.iconWrap}>
					<IconCheck size="fill" />
				</div>
			)}

			<input
				id={id}
				type="radio"
				className={`${styles.input} hidden`}
				name={name}
				value={value}
				checked={checked}
				defaultChecked={defaultChecked}
				onChange={handleChange}
				disabled={disabled}
				{...rest}
			/>
			{children}
		</label>
	);
}
