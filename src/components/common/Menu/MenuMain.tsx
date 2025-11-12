import { useRef, useState } from 'react';
import { MenuProvider } from './MenuProvider';
import styles from './Menu.module.scss';
import useClickOutside from '../../../hooks/useClickOutside';
import { classNames } from '../../../utils/classNames';

interface MenuMainProps {
	className?: string;
	open?: boolean;
	hover?: boolean;
	onChange?: (open: boolean) => void;
	children: React.ReactNode;
}

export default function MenuMain({
	className: classNameProp,
	open: controlledOpen,
	hover = false,
	onChange,
	children
}: MenuMainProps) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

	const isControlled = controlledOpen != undefined;
	const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

	const setIsOpen = (value: boolean) => {
		if (!isControlled) setUncontrolledOpen(value);
		onChange?.(value);
	};

	const targetRef = useRef<HTMLDivElement>(null);

	useClickOutside<HTMLDivElement>(targetRef, () => setIsOpen(false));

	const handleMouseEnter = () => {
		if (hover) setIsOpen(true);
	};
	const handleMouseLeave = () => {
		if (hover) setIsOpen(false);
	};

	const className = classNames(styles.menu, isOpen && 'open', classNameProp);

	return (
		<MenuProvider value={{ isOpen, setIsOpen }}>
			<div
				className={className}
				ref={targetRef}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}>
				{children}
			</div>
		</MenuProvider>
	);
}
