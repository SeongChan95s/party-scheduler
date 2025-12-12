import { IconArrowStick, IconHomeFilled, IconNotifyOutlined } from '../../common/Icon';
import { IconButton } from '../../common/IconButton';
import { useRef, useEffect, useState, startTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useScrollDirection from '../../../hooks/useScrollDirection';
import { classNames } from '../../../utils/classNames';
import styles from './NavBar.module.scss';

interface NavBarProps {
	title?: string | boolean;
	subText?: string;
	back?: boolean;
	logo?: boolean;
	home?: boolean;
	search?: boolean;
	darkMode?: boolean;
	notify?: boolean;
	action?: React.ReactNode;
}

interface PathMap {
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
	action: undefined
};

const pathMap: PathMap[] = [
	{
		path: '/',
		props: { logo: true, notify: true },
		exact: true
	},
	{
		path: '/party',
		props: { logo: true, notify: true }
	},
	{
		path: '/detail',
		props: { title: true, back: true }
	},
	{
		path: '/chat',
		props: { logo: true, notify: true }
	},
	{
		path: '/my',
		props: { logo: true, notify: true }
	},
	{
		path: '/auth',
		props: { title: true, back: true }
	}
];

/**
 * url에 따라 미리 저장된 객체를 반환하는 훅
 */
function useNavPath() {
	const { pathname } = useLocation();
	const [matchedPath, setMatchedPath] = useState<PathMap | undefined>();

	useEffect(() => {
		const requestTitle = requestAnimationFrame(() => {
			startTransition(() => {
				setMatchedPath(() => {
					let result = pathMap.find(({ path, exact = false }) =>
						exact ? pathname == path : pathname.startsWith(path)
					);
					const currentTitle = document.title;
					if (result?.props?.title)
						result.props.title = currentTitle.replace('파티 스케줄러 :', '');

					return result ? { ...result } : undefined;
				});
			});
		});

		return () => {
			setMatchedPath(undefined);
			cancelAnimationFrame(requestTitle);
		};
	}, [pathname]);

	return { ...matchedPath };
}

export default function NavBar() {
	const navigate = useNavigate();
	const matchedPath = useNavPath();
	const scrollFlag = useScrollDirection();
	const titleRef = useRef<HTMLHeadingElement>(null);
	const [titleIsOverflowing, setTitleIsOverflowing] = useState(false);
	let navBarProps = { ...initialNavBarProps, ...matchedPath?.props };

	useEffect(() => {
		if (titleRef.current && navBarProps.title) {
			const element = titleRef.current;
			const isOverflow = element.scrollWidth > element.clientWidth;
			setTitleIsOverflowing(isOverflow);
		}
	}, [navBarProps.title]);

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
								onClick={() => navigate(-1)}
							/>
						)}

						{navBarProps.logo && (
							<h1 className={styles.logo} onClick={() => navigate('/')}>
								<img src="/favicon.png" />
							</h1>
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
						{navBarProps.home && <IconButton size="lg" icon={<IconHomeFilled />} />}
						{navBarProps.notify && <IconButton size="lg" icon={<IconNotifyOutlined />} />}
						{navBarProps.darkMode && (
							<IconButton size="lg" icon={<IconNotifyOutlined />} />
						)}
					</div>
				</nav>
			</div>
		</header>
	);
}
