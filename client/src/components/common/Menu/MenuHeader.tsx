import { cloneElement, isValidElement } from 'react';
import type { ReactElement } from 'react';
import { IconMoreVertical } from '../Icon';
import styles from './Menu.module.scss';
import { useMenu } from './Menu.hooks';

interface Props {
	as?: ReactElement;
	className?: string;
}

export default function MenuHeader({ as, className = '' }: Props) {
	const defaultTrigger = (
		<button>
			<IconMoreVertical />
		</button>
	);

	const header = as ?? defaultTrigger;

	const { isOpen, setIsOpen } = useMenu();

	if (!isValidElement(header)) {
		return null;
	}

	return cloneElement(
		header as ReactElement<{ className?: string; onClick?: () => void }>,
		{
			className: `${styles.header} ${className} ${
				(header.props as { className?: string }).className ?? ''
			}`,
			onClick: () => {
				setIsOpen(!isOpen);
			}
		}
	);
}
