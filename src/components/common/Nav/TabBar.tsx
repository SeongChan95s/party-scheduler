import {
	IconFeedFilled,
	IconFeedOutlined,
	IconHeartFilled,
	IconHeartOutlined,
	IconHomeFilled,
	IconHomeOutlined,
	IconPersonFilled,
	IconPersonOutlined,
	IconSearchFilled,
	IconSearchOutlined
} from '../Icon';

import AppBar from '../../common/AppBar/AppBar';
import styles from './TabBar.module.scss';
import { Link, useLocation } from 'react-router-dom';

export default function TabBar() {
	const { pathname } = useLocation();
	const TabBarProps = [
		{
			label: 'explorer',
			href: '/explorer',
			icons: {
				normal: <IconSearchOutlined size="fill" />,
				activated: <IconSearchFilled size="fill" />
			}
		},
		{
			label: 'feed',
			href: '/feed',
			icons: {
				normal: <IconFeedOutlined size="fill" />,
				activated: <IconFeedFilled size="fill" />
			}
		},
		{
			label: 'home',
			href: '/home',
			end: true,
			icons: {
				normal: <IconHomeOutlined size="fill" />,
				activated: <IconHomeFilled size="fill" />
			}
		},
		{
			label: 'like',
			href: '/wish',
			icons: {
				normal: <IconHeartOutlined size="fill" />,
				activated: <IconHeartFilled size="fill" />
			}
		},
		{
			label: 'my',
			href: '/my',
			icons: {
				normal: <IconPersonOutlined size="fill" />,
				activated: <IconPersonFilled size="fill" />
			}
		}
	];

	return (
		<AppBar id={styles.tabBar}>
			<nav>
				<ul>
					{TabBarProps.map((prop, i) => (
						<li key={i}>
							<Link className={styles.link} to={prop.href}>
								<div className={styles.iconButton}>
									{pathname.includes(prop.href)
										? prop.icons.activated
										: prop.icons.normal}
								</div>
								<span className={styles.label}>{prop.label.toUpperCase()}</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</AppBar>
	);
}
