import { classNames } from '../../../utils/classNames';
import styles from './TextButton.module.scss';

interface TextButtonProps {
	id?: string;
	className?: string;
	type?: 'button' | 'submit' | 'reset';
	color?: 'normal' | 'primary';
	icon?: React.ReactElement;
	fill?: boolean;
	form?: string;
	formAction?: (formData: FormData) => void;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	children?: React.ReactNode;
}

export default function TextButton({
	id,
	className: classNameProp,
	type = 'button',
	color = 'normal',
	fill = false,
	form,
	formAction,
	onClick,
	disabled = false,
	children
}: TextButtonProps) {
	const className = classNames(
		styles.button,
		styles[color],
		fill && styles.fill,
		disabled && styles.disabled,
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
