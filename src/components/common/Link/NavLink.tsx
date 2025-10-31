'use client';

import { useViewTransition } from '@/app/hooks';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavLinkProps {
	href: string;
	className?: string;
	children: React.ReactNode;
	transition?: 'prev' | 'next';
	activeClass?: string;
	exact?: boolean;
	onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export default function NavLink({
	href,
	className = '',
	transition,
	onClick,
	activeClass: activeClassProp = 'active',
	exact = false,
	children
}: NavLinkProps) {
	const { handleViewTransition } = useViewTransition();
	const [isActive, setIsActive] = useState(false);
	const pathname = usePathname();
	const activeClass = isActive ? activeClassProp : '';
	const realHref = href.split('?')[0];

	const handleClickLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		e.stopPropagation();
		handleViewTransition(href, transition as string);

		if (onClick) onClick(e);
	};

	useEffect(() => {
		if (!exact) {
			if (decodeURIComponent(pathname).includes(realHref)) {
				setIsActive(true);
			} else {
				setIsActive(false);
			}
		} else {
			if (decodeURIComponent(pathname) == realHref) {
				setIsActive(true);
			} else {
				setIsActive(false);
			}
		}
	}, [pathname]);

	return (
		<a href={href} className={`${activeClass} ${className}`} onClick={handleClickLink}>
			{children}
		</a>
	);
}
