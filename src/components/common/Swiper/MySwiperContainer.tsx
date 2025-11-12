import styles from './MySwiperContainer.module.scss';

interface MySwiperContainerProps {
	className?: string;
	children: React.ReactNode;
}

export default function MySwiperContainer({
	className,
	children
}: MySwiperContainerProps) {
	return <div className={`${styles.mySwiperContainer} ${className}`}>{children}</div>;
}
