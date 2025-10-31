'use client';

import { useCallback, useEffect, useState, forwardRef } from 'react';
import Placeholder from '../Form/Placeholder';
import { classNames } from '@/app/utils';
import styles from './Input.module.scss';
import { IconAlertFilled } from '../Icon';

interface InputProps {
	id?: string;
	className?: string;
	name?: string;
	type?: 'text' | 'number' | 'tel' | 'email' | 'password';
	variant?: 'outlined' | 'filled' | 'dynamic';
	size?: 'sm' | 'md' | 'lg';
	value?: string;
	defaultValue?: string;
	label?: string;
	button?: React.ReactNode;
	placeholder?: string;
	maxLength?: number;
	form?: string;
	fill?: boolean;
	readOnly?: boolean;
	required?: boolean;
	disabled?: boolean;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	error?: string;
	children?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{
		id,
		className: classNameProp,
		name,
		type = 'text',
		size = 'md',
		value,
		defaultValue,
		label,
		button,
		required,
		placeholder: placeholderProp,
		variant = 'outlined',
		maxLength,
		form,
		readOnly = false,
		fill = false,
		disabled = false,
		onChange,
		error,
		children
	},
	ref
) {
	const [isEntered, setIsEntered] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = useCallback(() => setIsFocused(true), []);
	const handleBlur = useCallback(() => setIsFocused(false), []);

	const handleRef = useCallback(
		(element: HTMLInputElement | null) => {
			if (typeof ref === 'function') {
				ref(element);
			} else if (ref) {
				ref.current = element;
			}

			if (element?.value) {
				setIsEntered(element.value.length >= 1);
			}
		},
		[ref]
	);

	useEffect(() => {
		if (defaultValue) setIsEntered(defaultValue.length >= 1);
		if (value !== undefined) setIsEntered(value.length >= 1);
	}, []);

	const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIsEntered(e.target.value.length >= 1);
		onChange?.(e);
	};

	const placeholder = !(variant == 'dynamic') || isFocused ? placeholderProp : '';

	const className = classNames(
		styles.textField,
		styles[variant],
		styles[size],
		isFocused && styles.focused,
		fill && styles.fill,
		'input',
		classNameProp
	);

	return (
		<div className={className}>
			<Placeholder
				label={label}
				variant={variant}
				size={size}
				enter={isEntered}
				focus={isFocused}
				disable={disabled}
				button={button}>
				<input
					ref={handleRef}
					type={type}
					id={id}
					name={name}
					placeholder={placeholder}
					value={value}
					maxLength={maxLength}
					disabled={disabled}
					defaultValue={defaultValue}
					onChange={changeHandler}
					onFocus={handleFocus}
					onBlur={handleBlur}
					readOnly={readOnly}
					required={required}
					form={form}
				/>
			</Placeholder>
			{children}
			{error && (
				<div className={styles.error}>
					<IconAlertFilled size="sm" />
					<span>{error}</span>
				</div>
			)}
		</div>
	);
});

export default Input;
