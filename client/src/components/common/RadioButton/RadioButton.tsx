import type { InputHTMLAttributes } from 'react';
import { IconCheck } from '../Icon';
import styles from './RadioButton.module.scss';
import { classNames } from '../../../utils/classNames';

interface RadioButtonProps {
	id?: string;
	className?: string;
	name: string;
	value?: string;
	color?: 'normal' | 'primary';
	icon?: 'rounded' | 'round';
	variant?: 'standard' | 'box';
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
	color = 'normal',
	icon = 'rounded',
	variant = 'standard',
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
		styles[color],
		styles[icon],
		styles[variant],
		checked && styles.checked,
		fill && styles.fill,
		'radioButton',
		classNameProp
	);

	return (
		<label className={className} htmlFor={id}>
			{variant == 'standard' && (
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
