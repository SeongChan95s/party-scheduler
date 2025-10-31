'use client';

import { MouseEventHandler } from 'react';
import styles from './Menu.module.scss';
import { useMenu } from './Menu.hooks';

interface Props {
	className?: string;
	component?: React.ReactElement;
	children?: React.ReactNode;
	onClick?: MouseEventHandler;
}

export default function MenuItem({ className = '', onClick, children }: Props) {
	const { setIsOpen } = useMenu();

	return (
		<div
			className={`${styles.item} ${className}`}
			onClick={e => {
				if (onClick) {
					onClick(e);
				}
				setIsOpen(false);
			}}>
			{children}
		</div>
	);
}
