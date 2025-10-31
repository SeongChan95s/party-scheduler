'use client';

import { useEffect, useState } from 'react';
import styles from './IconButton.module.scss';
import { classNames } from '@/app/utils';

interface IconButtonProps {
	className?: string;
	size?: 'sm' | 'md' | 'lg';
	feedback?: boolean;
	isClicked?: boolean;
	onClick?: React.MouseEventHandler;
	children: React.ReactNode;
	type?: 'button' | 'submit';
	rest?: React.HTMLAttributes<HTMLButtonElement>;
}

export default function IconButton({
	className: classNameProp,
	size = 'md',
	feedback = false,
	isClicked = false,
	onClick: handleClick,
	type = 'button',
	children,
	...rest
}: IconButtonProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [count, setCount] = useState(0);

	const handleFeedback = () => {
		setIsPlaying(true);

		const timer = setTimeout(() => {
			setIsPlaying(false);
			clearTimeout(timer);
		}, 200);
	};

	const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (feedback) handleFeedback();
		handleClick?.(e);
	};

	useEffect(() => {
		if (feedback && count > 0) handleFeedback();
		setCount(count => count + 1);
	}, [isClicked]);

	const className = classNames(
		styles.iconButton,
		styles[size],
		feedback && styles.feedback,
		feedback && isPlaying && styles.isClick,
		'icon-button',
		classNameProp
	);

	return (
		<button className={className} type={type} {...rest} onClick={onClick}>
			{children}
		</button>
	);
}
