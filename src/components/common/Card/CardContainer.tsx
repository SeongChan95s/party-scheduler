import { classNames } from '@/app/utils';
import styles from './Card.module.scss';

interface CardContainerProps {
	className?: string;
	onClick?: React.MouseEventHandler;
	variant?: 'standard' | 'float';
	children: React.ReactNode;
	rest?: React.HTMLAttributes<HTMLDivElement>;
}

export default function CardContainer({
	className: classNameProp,
	variant = 'standard',
	onClick,
	children,
	...rest
}: CardContainerProps) {
	const className = classNames(styles[variant], classNameProp);

	return (
		<div className={className} onClick={onClick} {...rest}>
			{children}
		</div>
	);
}
