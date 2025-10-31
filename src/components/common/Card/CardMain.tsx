import { classNames } from '@/app/utils';
import styles from './Card.module.scss';

interface CardProps {
	className?: string;
	direction?: 'vertical' | 'horizontal';
	as?: React.ElementType;
	onClick?: React.MouseEventHandler;
	children: React.ReactNode;
}

export default function CardMain({
	className: classNameProp,
	as: Component = 'div',
	direction = 'vertical',
	onClick,
	children
}: CardProps) {
	const className = classNames(styles.card, styles[direction], classNameProp);

	return (
		<Component className={className} onClick={onClick}>
			{children}
		</Component>
	);
}
