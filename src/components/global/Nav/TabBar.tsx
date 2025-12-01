import {
	IconHomeFilled,
	IconHomeOutlined,
	IconPersonFilled,
	IconPersonOutlined,
	IconStarFilled,
	IconStarOutlined,
	IconTalkFilled,
	IconTalkOutlined
} from '../../common/Icon';

import AppBar from '../../common/AppBar/AppBar';
import { Link, useLocation } from 'react-router-dom';
import styles from './TabBar.module.scss';

export default function TabBar() {
	const { pathname } = useLocation();

	const TabBarProps = [
		{
			label: '홈',
			href: '/',
			exact: true,
			icons: {
				normal: <IconHomeOutlined size="fill" />,
				activated: <IconHomeFilled size="fill" />
			}
		},
		{
			label: '파티',
			href: '/party',
			icons: {
				normal: <IconStarOutlined size="fill" />,
				activated: <IconStarFilled size="fill" />
			}
		},
		{
			label: '채팅',
			href: '/chat',
			icons: {
				normal: <IconTalkOutlined size="fill" />,
				activated: <IconTalkFilled size="fill" />
			}
		},
		{
			label: '마이',
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
				<ul className={styles.container}>
					{TabBarProps.map((prop, i) => (
						<li key={i}>
							<Link className={styles.link} to={prop.href}>
								<div className={styles.iconWrap}>
									{prop.exact
										? pathname == prop.href
											? prop.icons.activated
											: prop.icons.normal
										: pathname.startsWith(prop.href)
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
