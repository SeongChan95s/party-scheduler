import { useState } from 'react';
import { classNames } from '../../../utils/classNames';
import styles from './IconButton.module.scss';

interface IconButtonProps {
	className?: string;
	size?: 'sm' | 'md' | 'lg';
	icon?: React.ReactNode;
	feedback?: boolean;
	onClick?: React.MouseEventHandler;
	type?: 'button' | 'submit';
	rest?: React.HTMLAttributes<HTMLButtonElement>;
}

export default function IconButton({
	className: classNameProp,
	icon,
	size = 'md',
	feedback = false,
	onClick: handleClick,
	type = 'button',
	...rest
}: IconButtonProps) {
	const [isPlaying, setIsPlaying] = useState(false);

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
			{icon}
		</button>
	);
}
