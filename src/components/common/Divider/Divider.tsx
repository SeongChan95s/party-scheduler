import { classNames } from '../../../utils/classNames';
import styles from './Divider.module.scss';

interface DividerProps {
	className?: string;
	color?: 'light' | 'dark';
	variant?: 'line' | 'depth';
	inner?: boolean;
	direction?: 'horizontal' | 'vertical';
}

export default function Divider({
	className: classNameProp,
	variant = 'line',
	color = 'light',
	inner = false,
	direction = 'horizontal'
}: DividerProps) {
	const className = classNames(
		styles.divider,
		styles[color],
		styles[variant],
		inner && 'inner',
		'divider',
		classNameProp
	);

	return (
		<div className={className}>
			<span className={`${styles.line} ${styles[direction]} line`}></span>
		</div>
	);
}
