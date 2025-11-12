import { useRef } from 'react';
import { useMenu } from './Menu.hooks';
import useKeepInLayout from '../../../hooks/useKeepInLayout';
import styles from './Menu.module.scss';

interface Props {
	children: React.ReactNode;
}

export default function MenuContainer({ children }: Props) {
	const { isOpen } = useMenu();
	const containerRef = useRef<HTMLUListElement>(null);

	const { isPending, x, y } = useKeepInLayout({
		targetRef: containerRef,
		isVisible: isOpen,
		offset: 14
	});
	const directionY = y >= 0 ? 'bottom' : 'top';

	if (isPending) return;

	return (
		isOpen && (
			<ul
				className={`${styles.container} ${styles[directionY]}`}
				ref={containerRef}
				style={{ '--offset-left': x + 'px' } as React.CSSProperties}>
				{children}
			</ul>
		)
	);
}
