import { IconClose } from '../Icon';
import { useSideSheet } from './SideSheet.hooks';
import styles from './SideSheet.module.scss';

console.log('styles', styles);

interface SideSheetCloseButtonProps {
	className?: string;
	as?: React.ReactNode;
}

export default function SideSheetCloseButton({
	className,
	as
}: SideSheetCloseButtonProps) {
	const { setIsOpen } = useSideSheet();

	return (
		<button
			className={`${styles.closeButton} ${className}`}
			onClick={() => setIsOpen(false)}>
			{as ?? <IconClose />}
		</button>
	);
}
