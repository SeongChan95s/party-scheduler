import { classNames } from '../../../utils/classNames';
import styles from './Flag.module.scss';

interface FlagProps {
	variant?: 'filled' | 'outlined' | 'depth';
	color?: 'normal' | 'primary';
	children?: React.ReactNode;
	className?: string;
	onClick?: React.MouseEventHandler;
	rest?: React.HTMLAttributes<HTMLDivElement>;
}

export default function Flag({
	variant = 'filled',
	color = 'normal',
	children,
	className: classNameProp,
	onClick,
	...rest
}: FlagProps) {
	const className = classNames(
		styles.flag,
		styles[variant],
		styles[color],
		'flag',
		classNameProp
	);
	return (
		<span className={className} onClick={onClick} {...rest}>
			{children}
		</span>
	);
}
