'use client';

import { forwardRef } from 'react';
import { IconCheck } from '../Icon';
import styles from './Checkbox.module.scss';
import { classNames } from '@/app/utils';

interface CheckboxProps {
	className?: string;
	name?: string;
	value?: string;
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onInput?: React.FormEventHandler<HTMLInputElement>;
	children?: React.ReactNode;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
	{
		className: classNameProp,
		name,
		value,
		disabled = false,
		checked: checkedProp,
		onChange,
		onInput,
		children
	},
	ref
) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e);
	};

	const className = classNames(styles.checkbox, 'checkbox', classNameProp);

	return (
		<label className={className}>
			<div className={styles.container}>
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
				<IconCheck size="fill" className={styles.icon} />
			</div>
			<span className={`${styles.label} label`}>{children}</span>
		</label>
	);
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
