import { AccordionProvider } from './AccordionProvider';
import { useState } from 'react';
import styles from './Accordion.module.scss';
import { classNames } from '../../../utils/classNames';

interface AccordionMainProps {
	className?: string;
	open?: boolean;
	onChange?: (value: boolean) => void;
	children?: React.ReactNode;
}

/**
 * 아코디언 컴포넌트
 */
export default function AccordionMain({
	className: classNameProp,
	open: controlledOpen,
	onChange,
	children
}: AccordionMainProps) {
	const [open, setOpen] = useState(false);

	const isControlled = controlledOpen != undefined;
	const isOpen = isControlled ? controlledOpen : open;

	const setIsOpen = (value: boolean) => {
		if (!isControlled) setOpen(value);
		onChange?.(value);
	};

	const className = classNames(styles.accordion, isOpen && 'opened', classNameProp);

	return (
		<AccordionProvider value={{ isOpen, setIsOpen }}>
			<div className={className}>{children}</div>
		</AccordionProvider>
	);
}
