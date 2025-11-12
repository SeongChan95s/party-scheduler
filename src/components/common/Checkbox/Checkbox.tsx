import { forwardRef } from 'react';
import { IconCheck } from '../Icon';
import styles from './Checkbox.module.scss';
import { classNames } from '../../../utils/classNames';

interface CheckboxProps {
	className?: string;
	variant?: 'standard' | 'box';
	icon?: 'rounded' | 'round';
	name?: string;
	value?: string;
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
	color?: 'normal' | 'primary';
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onInput?: React.FormEventHandler<HTMLInputElement>;
	children?: React.ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
	{
		className: classNameProp,
		variant = 'standard',
		name,
		value,
		icon = 'rounded',
		disabled = false,
		checked: checkedProp,
		color = 'normal',
		onChange,
		onInput,
		children
	},
	ref
) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e);
	};

	const className = classNames(
		styles.checkbox,
		styles[icon],
		styles[variant],
		styles[color],
		'checkbox',
		classNameProp
	);

	return (
		<label className={className}>
			{variant == 'standard' && (
				<div className={styles.iconWrap}>
					<IconCheck size="fill" className={`${styles.icon} icon`} />
				</div>
			)}

			<span className={`${styles.label} label`}>{children}</span>
			<input
				ref={ref}
				type="checkbox"
				className={`${styles.input} hidden `}
				name={name}
				value={value}
				checked={checkedProp}
				onChange={handleChange}
				onInput={onInput}
				disabled={disabled}
			/>
		</label>
	);
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
