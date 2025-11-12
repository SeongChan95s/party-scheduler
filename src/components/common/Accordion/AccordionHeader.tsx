import { classNames } from '../../../utils/classNames';
import { IconArrowTrim } from '../Icon';
import { useAccordion } from './Accordion.hooks';
import styles from './Accordion.module.scss';

interface AccordionHeaderProps {
	className?: string;
	icon?: React.ReactNode;
	children?: React.ReactNode;
}

export default function AccordionHeader({
	icon,
	className: classNameProp,
	children
}: AccordionHeaderProps) {
	const { isOpen, setIsOpen } = useAccordion();
	const className = classNames(styles.header, classNameProp);

	return (
		<div className={className} onClick={() => setIsOpen(!isOpen)}>
			{children}
			{icon ? icon : <IconArrowTrim className={styles.arrow} size="sm" />}
		</div>
	);
}
