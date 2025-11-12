import { IconArrowStick, IconHomeFilled } from '../../common/Icon';
import { IconButton } from '../../common/IconButton';
import { useMemo, useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useScrollDirection from '../../../hooks/useScrollDirection';
import { classNames } from '../../../utils/classNames';
import styles from './NavBar.module.scss';

interface NavBarProps {
	title?: string;
	subText?: string;
	back?: boolean;
	logo?: boolean;
	home?: boolean;
	search?: boolean;
	darkMode?: boolean;
	notify?: boolean;
	cart?: boolean;
	lnb?: boolean;
	action?: React.ReactNode;
}

interface pathMap {
	path: string;
	exact?: boolean;
	color?: 'light' | 'dark' | 'glass' | 'transparent';
	scroll?: {
		type?: 'transform' | 'reverse';
		maxScroll?: number;
	};
	props?: NavBarProps;
}

const initialNavBarProps: NavBarProps = {
	title: undefined,
	back: false,
	logo: false,
	home: false,
	search: false,
	darkMode: false,
	notify: false,
	cart: false,
	lnb: false,
	action: undefined
};

/**
 * url에 따라 미리 저장된 객체를 반환하는 훅
 */
function useNavPath() {
	const location = useLocation();
	const pathMap: pathMap[] = useMemo(
		() => [
			{
				path: '/home',
				color: 'glass',
				scroll: { type: 'transform', maxScroll: 90 },
				props: { logo: true, darkMode: true, notify: true, cart: true, lnb: true }
			}
		],
		[]
	);

	const matchedPath = pathMap.find(({ path, exact = false }) =>
		exact ? location.pathname === path : location.pathname.startsWith(path)
	);

	return matchedPath;
}

export default function NavBar() {
	const matchedPath = useNavPath();
	const scrollFlag = useScrollDirection();
	const titleRef = useRef<HTMLHeadingElement>(null);
	const [titleIsOverflowing, setTitleIsOverflowing] = useState(false);
	let navBarProps = { ...initialNavBarProps, ...matchedPath?.props };
	navBarProps.title = navBarProps?.title ?? '';

	useEffect(() => {
		if (titleRef.current && matchedPath?.props?.title) {
			const element = titleRef.current;
			const isOverflow = element.scrollWidth > element.clientWidth;
			setTitleIsOverflowing(isOverflow);
		}
	}, [matchedPath?.props?.title]);

	const handleClickTitle = () => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
	};

	const className = classNames(
		styles.navBar,
		`${scrollFlag}`,
		`${matchedPath?.scroll?.type}`
	);

	return (
		<header id="navBar" className={className}>
			<div className={styles.container}>
				<nav className={styles.gnb}>
					<div className={styles.navLeft}>
						{navBarProps.back && (
							<IconButton
								className={styles.backButton}
								icon={<IconArrowStick />}
								size="lg"
							/>
						)}

						{navBarProps.action && navBarProps.action}

						{navBarProps.title && (
							<div
								className={`${styles.titleBox} ${
									titleIsOverflowing ? styles.marquee : ''
								}`}>
								<h2 ref={titleRef} onClick={handleClickTitle}>
									{navBarProps.title}
								</h2>
							</div>
						)}
					</div>

					<div className={styles.quickMenu}>
						<div className={styles.quickMenuContainer}>
							{navBarProps.home && (
								<Link to="/home">
									<IconHomeFilled />
								</Link>
							)}
						</div>
					</div>
				</nav>
			</div>
		</header>
	);
}
