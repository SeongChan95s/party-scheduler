import { classNames } from '@/app/utils';
import styles from './Chip.module.scss';

interface ChipProps {
	variant?: 'filled' | 'outlined' | 'depth';
	size?: 'sm' | 'md' | 'lg';
	color?: 'standard' | 'primary';
	children?: React.ReactNode;
	className?: string;
	onClick?: React.MouseEventHandler;
	rest?: React.HTMLAttributes<HTMLDivElement>;
}

export default function Chip({
	variant = 'filled',
	size = 'md',
	color = 'standard',
	children,
	className: classNameProp,
	onClick,
	...rest
}: ChipProps) {
	const className = classNames(
		styles.chip,
		styles[variant],
		styles[size],
		styles[color],
		'chip',
		classNameProp
	);
	return (
		<div className={className} onClick={onClick} {...rest}>
			{children}
		</div>
	);
}
