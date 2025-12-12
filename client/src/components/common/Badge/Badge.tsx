import styles from './Badge.module.scss';
import { classNames } from '../../../utils/classNames';

interface BadgeProps {
	className?: string;
	visible?: boolean;
	render?: React.ReactNode;
	size?: 'sm' | 'md';
	children: React.ReactNode;
}

export default function Badge({
	className: classNameProp,
	visible = true,
	render,
	size = 'md',
	children
}: BadgeProps) {
	const className = classNames(styles.badge, styles[size], classNameProp);

	return (
		<div className={styles.badgeWrap}>
			{children}
			{visible && <span className={className}>{render}</span>}
		</div>
	);
}
