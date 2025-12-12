import { useRef, useState } from 'react';
import styles from './Tooltip.module.scss';
import useKeepInLayout from '../../../hooks/useKeepInLayout';
import useClickOutside from '../../../hooks/useClickOutside';
import { IconAlertFilled } from '../Icon';

interface TooltipProps {
	icon?: React.ReactNode;
	children: React.ReactNode;
}

export default function Tooltip({ children, icon = <IconAlertFilled /> }: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);
	const targetRef = useRef(null);
	useClickOutside<HTMLDivElement>(targetRef, () => setIsVisible(false));
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
		<div className={styles.tooltip} ref={targetRef}>
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
