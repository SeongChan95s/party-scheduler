import { classNames } from '../../../utils/classNames';
import styles from './Placeholder.module.scss';

export default function Placeholder({
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
	children
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
	children?: React.ReactNode;
}) {
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
			<div className={styles.wrap}>
				<div className={`${styles.container} placeholder-container`}>
					{children}
					{element && <div className={styles.elementWrap}>{element}</div>}
				</div>
			</div>
		</div>
	);
}
