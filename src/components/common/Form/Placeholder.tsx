'use client';

import { classNames } from '@/app/utils';
import styles from './Placeholder.module.scss';

export default function Placeholder({
	className: classNameProp,
	label,
	variant = 'outlined',
	size = 'md',
	enter,
	focus,
	button,
	disable = false,
	htmlFor,
	children
}: {
	className?: string;
	variant?: 'outlined' | 'filled' | 'dynamic';
	label?: string;
	enter?: boolean;
	htmlFor?: string;
	button?: React.ReactNode;
	focus?: boolean;
	size?: 'xs' | 'sm' | 'md' | 'lg';
	disable?: boolean;
	children?: React.ReactNode;
}) {
	const className = classNames(
		styles.placeholder,
		styles[variant],
		styles[size],
		focus && styles.focus,
		enter && styles.enter,
		disable && styles.disable,
		'placeholder',
		classNameProp
	);

	return (
		<div className={className}>
			{label && <label htmlFor={htmlFor}>{label}</label>}
			<div className={styles.wrap}>
				<div className={`${styles.container} placeholderContainer`}>{children}</div>
				{button}
			</div>
		</div>
	);
}
