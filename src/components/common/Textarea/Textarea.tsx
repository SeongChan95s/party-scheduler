'use client';

import { useEffect, useState } from 'react';
import { Placeholder } from '../Form';
import styles from './Textarea.module.scss';
import { classNames } from '@/app/utils';

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
	maxLength?: number;
	count?: boolean;
	validateFn?: {
		fn: (value: string) => boolean;
		message: string;
	}[];
	onValidate?: (validate: boolean) => void;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export default function Textarea({
	id,
	className: classNameProp,
	variant = 'dynamic',
	name,
	label,
	value: controlledValue,
	defaultValue = '',
	placeholder: placeholderProp,
	cols,
	rows,
	fill,
	maxLength,
	validateFn,
	onValidate,
	count,
	onChange
}: TextareaProps) {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const isControlled = controlledValue != undefined;
	const value = isControlled ? controlledValue : uncontrolledValue;
	const isEntered = value.length >= 1;
	const [isFocused, setIsFocused] = useState(false);

	const validateFilter = validateFn?.filter(el => !el.fn(value));
	const placeholder = variant != 'dynamic' || isFocused ? placeholderProp : '';

	useEffect(() => {
		if (validateFilter) onValidate?.(validateFilter.length < 1);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (!isControlled) setUncontrolledValue(e.target.value);

		if (validateFilter) onValidate?.(validateFilter.length < 1);
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
				<Placeholder label={label} enter={isEntered} focus={isFocused} variant={variant}>
					<textarea
						id={id}
						name={name}
						cols={cols}
						rows={rows}
						maxLength={maxLength}
						value={value}
						onChange={handleChange}
						onFocus={() => setIsFocused(true)}
						placeholder={placeholder}
						onBlur={() => setIsFocused(false)}></textarea>
				</Placeholder>
			</div>
			<div className={styles.state}>
				<div className={styles.validate}>
					{validateFilter?.map((el, i) => {
						if (i >= 2) return;
						return <span key={el.message}>{el.message}</span>;
					})}
				</div>

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
