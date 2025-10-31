'use client';

import { classNames } from '@/app/utils';
import styles from './Collapse.module.scss';

interface CollapseProps {
	line?: number;
	wrap?: boolean;
	className?: string;
	children: React.ReactNode;
}

export default function Collapse({
	line = 2,
	wrap = false,
	className: classNameProp,
	children
}: CollapseProps) {
	const className = classNames(
		styles.collapse,
		wrap && styles.wrap,
		classNameProp,
		'collapse',
		classNameProp
	);

	return (
		<div className={className} style={{ '--line': line } as React.CSSProperties}>
			{children}
		</div>
	);
}
