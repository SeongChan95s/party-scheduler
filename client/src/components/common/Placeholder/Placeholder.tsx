import { forwardRef } from 'react';
import { classNames } from '../../../utils/classNames';
import styles from './Placeholder.module.scss';

export default forwardRef(function Placeholder(
	{
		className: classNameProp,
		label,
		variant = 'outlined',
		size = 'md',
		enter,
		focus,
		element,
		error,
		disabled = false,
		onClick,
		htmlFor,
		as = 'input',
		...props
	}: {
		className?: string;
		variant?: 'outlined' | 'filled' | 'dynamic';
		label?: string;
		error?: boolean;
		enter?: boolean;
		htmlFor?: string;
		element?: React.ReactNode;
		focus?: boolean;
		size?: 'xs' | 'sm' | 'md' | 'lg';
		disabled?: boolean;
		onClick?: React.MouseEventHandler<HTMLDivElement>;
		onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
		as?: 'input' | 'textarea';
	} & Omit<
		React.InputHTMLAttributes<HTMLInputElement> &
			React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		'size' | 'onChange'
	>,
	ref: React.Ref<HTMLInputElement | HTMLTextAreaElement>
) {
	const className = classNames(
		styles.placeholder,
		styles[variant],
		styles[size],
		focus && 'focused',
		enter && 'entered',
		error && 'error',
		disabled && 'disabled',
		'placeholder',
		classNameProp
	);

	return (
		<div className={className} onClick={onClick}>
			{label && <label htmlFor={htmlFor}>{label}</label>}
			<div className={`${styles.container} placeholder-container`}>
				{as === 'textarea' ? (
					<textarea
						className={styles.formElement}
						ref={ref as React.Ref<HTMLTextAreaElement>}
						disabled={disabled}
						{...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
					/>
				) : (
					<input
						className={styles.formElement}
						ref={ref as React.Ref<HTMLInputElement>}
						disabled={disabled}
						{...(props as React.InputHTMLAttributes<HTMLInputElement>)}
					/>
				)}
				{element && <div className={styles.elementWrap}>{element}</div>}
			</div>
		</div>
	);
});
