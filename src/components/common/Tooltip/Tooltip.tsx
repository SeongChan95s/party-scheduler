'use client';

import { useRef, useState } from 'react';
import { useClickOutside, useKeepInLayout } from '@/app/hooks';
import styles from './Tooltip.module.scss';

interface TooltipProps {
	size?: 'sm' | 'md' | 'lg';
	icon: React.ReactNode;
	children: React.ReactNode;
}

export default function Tooltip({ children, size = 'md', icon }: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [tooltipRef] = useClickOutside<HTMLDivElement>(isVisible, setIsVisible);
	const containerRef = useRef<HTMLDivElement>(null);

	const { isPending, x, y } = useKeepInLayout({
		targetRef: containerRef,
		isVisible: isVisible,
		offset: 14
	});
	const directionY = y >= 0 ? 'bottom' : 'top';

	const handleClick = () => {
		setIsVisible(true);
	};

	return (
		<div className={`${styles.tooltip} ${styles[size]}`} ref={tooltipRef}>
			<div className={styles.iconWrap} onClick={handleClick}>
				{icon}
			</div>

			{!isPending && isVisible && (
				<div
					className={`${styles.container} ${styles[directionY]}`}
					ref={containerRef}
					style={{ '--offset-left': x + 'px' } as React.CSSProperties}>
					{children}
				</div>
			)}
		</div>
	);
}
