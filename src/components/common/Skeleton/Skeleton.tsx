import styles from './Skeleton.module.scss';

interface SkeletonProps {
	width?: string;
	height?: string;
	className?: string;
	count?: number;
	fontSize?: string;
	variant?: 'text' | 'rect' | 'rounded' | 'circle';
	fill?: boolean;
	inner?: boolean;
	children?: React.ReactNode;
	rest?: React.HTMLAttributes<HTMLDivElement>;
}

export default function Skeleton({
	className = '',
	variant = 'rounded',
	count = 1,
	width,
	height,
	fill = false,
	inner = false,
	fontSize = '1.6rem',
	children,
	...rest
}: SkeletonProps) {
	const variantClass = variant ? styles[variant] : '';
	const innerClass = inner ? styles.inner : '';
	const fillClass = fill ? styles.fill : '';

	return (
		<>
			{Array.from({ length: count }).map((_, i) => {
				return (
					<span
						className={`${styles.skeleton} ${variantClass} ${fillClass} ${innerClass} skeleton ${className}`}
						style={{ width, height, '--font-size': fontSize } as React.CSSProperties}
						{...rest}
						key={i}>
						{children}
					</span>
				);
			})}
		</>
	);
}
