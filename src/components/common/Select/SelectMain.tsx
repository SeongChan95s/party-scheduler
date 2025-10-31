'use client';

import React, { RefObject, useState } from 'react';
import { SelectProvider } from './SelectProvider';
import { useClickOutside } from '@/app/hooks';
import styles from './Select.module.scss';

interface SelectMainProps {
	className?: string;
	name?: string;
	defaultValue?: string;
	variant?: 'filled' | 'outlined' | 'dynamic';
	value?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg';
	fill?: boolean;
	inputRef?: RefObject<HTMLInputElement>;
	onChange?: (value: string) => void;
	children: React.ReactNode;
}

export default function SelectMain({
	className,
	name,
	defaultValue = '',
	value: controlledValue,
	size = 'md',
	variant = 'dynamic',
	fill,
	onChange,
	inputRef,
	children
}: SelectMainProps) {
	const hasValueProp =
		defaultValue != '' || (defaultValue == '' && controlledValue != undefined);

	const [isFocused, setIsFocused] = useState(false);
	const [isEntered, setIsEntered] = useState(hasValueProp);
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
	const [enableTextField, setEnableTextField] = useState(false);

	const [target] = useClickOutside<HTMLDivElement>(isFocused, setIsFocused);
	const fillClass = fill ? styles.fill : '';

	const isControlled = controlledValue != undefined;
	const value = isControlled ? controlledValue : uncontrolledValue;

	const setValue = (value: string) => {
		if (!isControlled) setUncontrolledValue(value);
		onChange?.(value);
	};

	return (
		<SelectProvider
			value={{
				name,
				variant,
				inputRef,
				size,
				isFocused,
				setIsFocused,
				isEntered,
				setIsEntered,
				value,
				setValue,
				enableTextField,
				setEnableTextField
			}}>
			<div
				className={`${styles.select} ${styles[size]} ${styles[variant]} ${fillClass} ${isFocused ? styles.enter : ''} select ${className}`}
				ref={target}>
				{children}
			</div>
		</SelectProvider>
	);
}
