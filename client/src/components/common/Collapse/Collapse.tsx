import { useState } from 'react';
import { classNames } from '../../../utils/classNames';
import styles from './Collapse.module.scss';

interface CollapseProps {
	line?: number;
	wrap?: boolean;
	className?: string;
	children: React.ReactNode;
}

export default function Collapse({
	line = 2,
	wrap: controlledWrap,
	className: classNameProp,
	children
}: CollapseProps) {
	const [uncontrolledWrap, setUncontrolledWrap] = useState(false);

	const isControlled = controlledWrap != undefined;
	const wrap = isControlled ? controlledWrap : uncontrolledWrap;
	const setWrap = (state: boolean) => {
		if (!isControlled) setUncontrolledWrap(state);
	};
	const className = classNames(styles.collapse, wrap && 'wrap', classNameProp);

	const handleClick = () => {
		setWrap(!wrap);
	};

	return (
		<div
			className={className}
			style={{ '--line': line } as React.CSSProperties}
			onClick={handleClick}>
			{children}
		</div>
	);
}
