'use client';

import styles from './Toast.module.scss';

interface ToastHeaderProps {
	children: React.ReactNode;
}

export default function ToastHeader({ children }: ToastHeaderProps) {
	return <header className={styles.header}>{children}</header>;
}
