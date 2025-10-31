import { classNames } from '@/app/utils';
import styles from './Flag.module.scss';

interface FlagProps {
	variant?: 'filled' | 'outlined' | 'depth';
	size?: 'sm' | 'md' | 'lg';
	color?: 'standard' | 'primary';
	children?: React.ReactNode;
	className?: string;
	onClick?: React.MouseEventHandler;
	rest?: React.HTMLAttributes<HTMLDivElement>;
}

export default function Flag({
	variant = 'filled',
	size = 'md',
	color = 'standard',
	children,
	className: classNameProp,
	onClick,
	...rest
}: FlagProps) {
	const className = classNames(
		styles.flag,
		styles[variant],
		styles[size],
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
