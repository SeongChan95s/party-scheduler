import { IconArrowTrim } from '../Icon';
import { Fragment } from 'react';
import styles from './Breadcrumb.module.scss';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames';

interface BreadcrumbProps {
	links: {
		name: string;
		href: string;
	}[];
	className?: string;
	rest?: React.HTMLAttributes<HTMLUListElement>;
}

export default function Breadcrumb({
	className: classNameProp,
	links,
	...rest
}: BreadcrumbProps) {
	const className = classNames(styles.breadcrumb, 'breadcrumb', classNameProp);

	return (
		<ul className={className} {...rest}>
			{links.map((link, i) => {
				return (
					<Fragment key={link.name}>
						<li>
							<Link to={link.href}>{link.name}</Link>
						</li>
						{i != links.length - 1 ? <IconArrowTrim className={styles.arrow} /> : ''}
					</Fragment>
				);
			})}
		</ul>
	);
}
