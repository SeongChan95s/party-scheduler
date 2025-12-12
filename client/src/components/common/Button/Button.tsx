import { classNames } from '../../../utils/classNames';
import styles from './Button.module.scss';

interface ButtonProps {
	id?: string;
	className?: string;
	type?: 'button' | 'submit' | 'reset';
	size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
	variant?: 'filled' | 'outlined' | 'depth';
	color?: 'normal' | 'primary';
	shape?: 'rect' | 'rounded' | 'round';
	fill?: boolean;
	form?: string;
	formAction?: (formData: FormData) => void;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	children?: React.ReactNode;
}

export default function Button({
	id,
	className: classNameProp,
	type = 'button',
	size = 'md',
	color = 'normal',
	variant = 'filled',
	shape = 'rounded',
	fill = false,
	form,
	formAction,
	onClick,
	disabled = false,
	children
}: ButtonProps) {
	const className = classNames(
		styles.button,
		styles[variant],
		styles[size],
		styles[color],
		styles[shape],
		fill && styles.fill,
		disabled && 'disabled',
		'button',
		classNameProp
	);

	return (
		<button
			className={className}
			id={id}
			type={type}
			form={form}
			formAction={formAction}
			onClick={onClick}>
			{children}
		</button>
	);
}
