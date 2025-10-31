import { classNames } from '@/app/utils';
import { Skeleton } from '../Skeleton';
import styles from './Chip.module.scss';

interface ChipProps {
	variant?: 'filled' | 'outlined' | 'depth';
	size?: 'sm' | 'md' | 'lg';
	color?: 'standard' | 'primary';
	className?: string;
	onClick?: React.MouseEventHandler;
	rest?: React.HTMLAttributes<HTMLDivElement>;
}

export default function ChipSkeleton({
	variant = 'filled',
	size = 'md',
	color = 'standard',
	className: classNameProp,
	onClick,
	...rest
}: ChipProps) {
	const className = classNames(
		styles.skeleton,
		styles.chip,
		styles[variant],
		styles[size],
		styles[color],
		'chip',
		classNameProp
	);

	return (
		<div className={className} onClick={onClick} {...rest}>
			<Skeleton fill />
		</div>
	);
}
