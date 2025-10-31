import { classNames } from '@/app/utils';
import styles from './List.module.scss';

interface ListMainProps {
	className?: string;
	size?: 'md';
	variant?: 'standard' | 'divider';
	children: React.ReactNode;
}

export default function ListMain({
	className: classNameProp,
	variant = 'standard',
	children,
	size = 'md',
	...rest
}: ListMainProps) {
	const className = classNames(
		styles.list,
		styles[size],
		styles[variant],
		'list',
		classNameProp
	);

	return (
		<div className={className} {...rest}>
			{children}
		</div>
	);
}
