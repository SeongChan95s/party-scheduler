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
} from '../../common/Icon';

import AppBar from '../../common/AppBar/AppBar';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './TabBar.module.scss';

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
			label: 'about',
			href: '/about',
			icons: {
				normal: <IconFeedOutlined size="fill" />,
				activated: <IconFeedFilled size="fill" />
			}
		},
		{
			label: 'home',
			href: '/',
			end: true,
			icons: {
				normal: <IconHomeOutlined size="fill" />,
				activated: <IconHomeFilled size="fill" />
			}
		},
		{
			label: 'detail',
			href: '/detail/1',
			icons: {
				normal: <IconHeartOutlined size="fill" />,
				activated: <IconHeartFilled size="fill" />
			}
		},
		{
			label: 'guide',
			href: '/guide/common/component',
			icons: {
				normal: <IconPersonOutlined size="fill" />,
				activated: <IconPersonFilled size="fill" />
			}
		}
	];

	return (
		<AppBar id={styles.tabBar}>
			<nav>
				<ul className={styles.container}>
					{TabBarProps.map((prop, i) => (
						<li key={i}>
							<NavLink className={styles.link} to={prop.href}>
								<div className={styles.iconButton}>
									{pathname.includes(prop.href)
										? prop.icons.activated
										: prop.icons.normal}
								</div>
								<span className={styles.label}>{prop.label.toUpperCase()}</span>
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</AppBar>
	);
}
