import { classNames } from '../../../utils/classNames';
import { useAccordion } from './Accordion.hooks';
import styles from './Accordion.module.scss';

interface AccordionHeaderProps {
	className?: string;
	children?: React.ReactNode;
}

export default function AccordionHeader({
	className: classNameProp,
	children
}: AccordionHeaderProps) {
	const { isOpen, setIsOpen } = useAccordion();
	const className = classNames(styles.header, classNameProp);

	return (
		<div className={className} onClick={() => setIsOpen(!isOpen)}>
			{children}
		</div>
	);
}
