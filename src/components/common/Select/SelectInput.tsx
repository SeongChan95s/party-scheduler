'use client';

import { Placeholder } from '../Form';
import { IconArrowTrim } from '../Icon';
import { useSelect } from './Select.hooks';
import styles from './Select.module.scss';

interface Props {
	id?: string;
	label?: string;
	placeholder?: string;
	enableTextField?: boolean;
}

export default function SelectInput({ id, label, placeholder }: Props) {
	const {
		name,
		inputRef,
		variant,
		size,
		isFocused,
		value,
		setIsFocused,
		isEntered,
		setValue,
		enableTextField
	} = useSelect();

	const iconClassName = isFocused ? styles.isFocused : '';

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (enableTextField) {
			setValue(e.target.value);
			setIsFocused(true);
		}
	};

	const handleInputFocus = () => {
		setIsFocused(!isFocused);
	};

	return (
		<Placeholder
			htmlFor={id}
			variant={variant}
			label={label}
			size={size}
			focus={isFocused}
			enter={isEntered}>
			<div className={`${styles.inputWrap} inputWrap`} onClick={handleInputFocus}>
				<input
					name={name}
					ref={inputRef}
					className={styles.textInput}
					id={id}
					value={value == '' && !enableTextField ? '' : value}
					onChange={handleInputChange}
					readOnly={!enableTextField}
					placeholder={placeholder}
				/>
				<IconArrowTrim className={iconClassName} size="sm" />
			</div>
		</Placeholder>
	);
}
