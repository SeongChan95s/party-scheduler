'use client';

import { useViewTransition } from '@/app/hooks';

interface LinkProps {
	href: string;
	className?: string;
	children: React.ReactNode;
	transition?: 'prev' | 'next';
	onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export default function Link({
	href,
	className,
	transition,
	onClick,
	children
}: LinkProps) {
	const { handleViewTransition } = useViewTransition();

	const handleClickLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		e.stopPropagation();
		handleViewTransition(href, transition as string);

		if (onClick) onClick(e);
	};

	return (
		<a href={href} className={className} onClick={handleClickLink}>
			{children}
		</a>
	);
}
