import styles from './Tab.module.scss';

interface TabHeaderProps {
	className?: string;
	children: React.ReactNode;
}

export default function TabHeader({ className, children }: TabHeaderProps) {
	return <div className={`${styles.tabHeader} ${className}`}>{children}</div>;
}
