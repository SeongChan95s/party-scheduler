import React, { useRef, useState, type RefObject } from 'react';
import { SelectProvider } from './SelectProvider';
import styles from './Select.module.scss';
import useClickOutside from '../../../hooks/useClickOutside';
import { Placeholder } from '../Placeholder';
import { IconArrowTrim } from '../Icon';
import SelectContainer from './SelectContainer';
import { classNames } from '../../../utils/classNames';

interface SelectMainProps {
	className?: string;
	name?: string;
	defaultValue?: string;
	variant?: 'filled' | 'outlined' | 'dynamic';
	id?: string;
	label?: string;
	placeholder?: string;
	enableTextField?: boolean;
	value?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg';
	direction?: 'top' | 'bottom';
	fill?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	inputRef?: RefObject<HTMLInputElement>;
	onChange?: (value: string) => void;
	children: React.ReactNode;
}

export default function SelectMain({
	id,
	className: classNameProp,
	label,
	placeholder: placeholderProp,
	name,
	defaultValue = '',
	value: controlledValue,
	size = 'md',
	variant = 'outlined',
	direction = 'bottom',
	fill,
	readOnly,
	disabled,
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

	const targetRef = useRef(null);
	useClickOutside<HTMLDivElement>(targetRef, () => setIsFocused(false));

	const isControlled = controlledValue != undefined;
	const value = isControlled ? controlledValue : uncontrolledValue;

	const setValue = (value: string) => {
		if (!isControlled) setUncontrolledValue(value);
		onChange?.(value);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (enableTextField) {
			setValue(e.target.value);
			setIsFocused(true);
		}
	};

	const handleInputFocus = () => {
		if (disabled || readOnly) return;
		setIsFocused(!isFocused);
	};

	const iconClassName = isFocused ? styles.isFocused : '';
	const placeholder = !(variant == 'dynamic') || isFocused ? placeholderProp : '';
	const className = classNames(
		styles.select,
		styles[size],
		styles[direction],
		styles[variant],
		fill && styles.fill,
		isFocused && 'focused',
		isEntered && 'entered',
		'select',
		classNameProp
	);

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
			<div className={className} ref={targetRef}>
				<Placeholder
					htmlFor={id}
					variant={variant}
					label={label}
					size={size}
					focus={isFocused}
					disabled={disabled}
					enter={isEntered}
					onClick={handleInputFocus}>
					<input
						name={name}
						ref={inputRef}
						id={id}
						value={value == '' && !enableTextField ? '' : value}
						onChange={handleInputChange}
						disabled={disabled}
						readOnly={!enableTextField}
						placeholder={placeholder}
						autoFocus={enableTextField}
					/>
					<IconArrowTrim className={iconClassName} size="sm" />
				</Placeholder>
				<SelectContainer>{children}</SelectContainer>
			</div>
		</SelectProvider>
	);
}
