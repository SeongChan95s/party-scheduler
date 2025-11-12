import { useState } from 'react';
import { classNames } from '../../../utils/classNames';
import { Placeholder } from '../Placeholder';
import { IconAlertFilled } from '../Icon';
import styles from './Textarea.module.scss';

interface TextareaProps {
	id?: string;
	className?: string;
	variant?: 'filled' | 'outlined' | 'dynamic';
	name?: string;
	label?: string;
	value?: string;
	defaultValue?: string;
	placeholder?: string;
	cols?: number;
	rows?: number;
	fill?: boolean;
	error?: string;
	maxLength?: number;
	count?: boolean;
	disabled?: boolean;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export default function Textarea({
	id,
	className: classNameProp,
	variant = 'outlined',
	name,
	label,
	value: controlledValue,
	defaultValue = '',
	placeholder: placeholderProp,
	cols,
	rows,
	fill,
	error,
	maxLength,
	count,
	disabled,
	onChange
}: TextareaProps) {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const isControlled = controlledValue != undefined;
	const value = isControlled ? controlledValue : uncontrolledValue;
	const isEntered = value.length >= 1;
	const [isFocused, setIsFocused] = useState(false);

	const placeholder = variant != 'dynamic' || isFocused ? placeholderProp : '';

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (!isControlled) setUncontrolledValue(e.target.value);
		onChange?.(e);
	};

	const className = classNames(
		styles.textarea,
		isFocused && styles.focused,
		styles[variant],
		fill && styles.fill,
		classNameProp
	);

	return (
		<div className={className}>
			<div className={styles.container}>
				<Placeholder
					label={label}
					enter={isEntered}
					focus={isFocused}
					variant={variant}
					error={!!error}
					disabled={disabled}>
					<textarea
						id={id}
						name={name}
						cols={cols}
						rows={rows}
						maxLength={maxLength}
						value={value}
						placeholder={placeholder}
						disabled={disabled}
						onChange={handleChange}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}></textarea>
				</Placeholder>
			</div>
			<div className={styles.state}>
				{error && (
					<div className={styles.error}>
						<IconAlertFilled />
						{error}
					</div>
				)}

				{count && (
					<div className={styles.count}>
						<span>{value.length}</span>
						{maxLength && <span>/</span>}
						{maxLength && <span>{maxLength}</span>}
					</div>
				)}
			</div>
		</div>
	);
}
