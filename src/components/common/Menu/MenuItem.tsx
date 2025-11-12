import { useMenu } from './Menu.hooks';
import type { MouseEventHandler } from 'react';
import styles from './Menu.module.scss';

interface Props {
	className?: string;
	children?: React.ReactNode;
	onClick?: MouseEventHandler;
}

export default function MenuItem({ className = '', onClick, children }: Props) {
	const { setIsOpen } = useMenu();

	return (
		<button
			className={`${styles.item} ${className}`}
			onClick={e => {
				if (onClick) {
					onClick(e);
				}
				setIsOpen(false);
			}}>
			{children}
		</button>
	);
}
