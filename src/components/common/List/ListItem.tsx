import { classNames } from '@/app/utils';
import styles from './List.module.scss';

interface ListItemProps {
	className?: string;
	as?: React.ElementType;
	onClick?: React.MouseEventHandler;
	children?: React.ReactNode;
	rest?: React.HTMLAttributes<HTMLElement>;
}

export default function ListItem({
	className: classNameProp,
	as: Component = 'div',
	onClick,
	children,
	...rest
}: ListItemProps) {
	const className = classNames(styles.item, 'list-item', classNameProp);

	return (
		<Component className={className} onClick={onClick} {...rest}>
			{children}
		</Component>
	);
}
