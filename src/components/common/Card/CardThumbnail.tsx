import { classNames } from '@/app/utils';
import styles from './Card.module.scss';

interface CardThumbnailProps {
	className?: string;
	shape?: 'rect' | 'rounded';
	ratio?: { width: number; height: number };
	children: React.ReactNode;
}

export default function CardThumbnail({
	className: classNameProp,
	shape = 'rounded',
	ratio = { width: 1, height: 1 },
	children
}: CardThumbnailProps) {
	const className = classNames(
		styles.thumbnail,
		styles[shape],
		'thumbnail',
		classNameProp
	);

	const ratioStyle =
		ratio && ratio.width && ratio.height
			? { aspectRatio: `${ratio.width}/${ratio.height}` }
			: undefined;

	return (
		<div className={className} style={ratioStyle}>
			{children}
		</div>
	);
}
