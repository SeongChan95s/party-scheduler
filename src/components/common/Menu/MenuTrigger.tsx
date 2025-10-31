'use client';

import { cloneElement, JSX } from 'react';
import { IconMoreVertical } from '../Icon';
import styles from './Menu.module.scss';
import { useMenu } from './Menu.hooks';

interface Props {
	Component?: JSX.Element;
	className?: string;
}

export default function MenuTrigger({ Component, className = '' }: Props) {
	Component = Component ?? (
		<button>
			<IconMoreVertical />
		</button>
	);

	const { isOpen, setIsOpen } = useMenu();

	return cloneElement(Component, {
		className: `${styles.trigger} ${className} ${Component?.props.className ?? ''}`,
		onClick: () => {
			setIsOpen(!isOpen);
		}
	});
}
