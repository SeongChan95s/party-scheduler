import { useEffect, useRef, useState } from 'react';

type Flag = 'top' | 'up' | 'down' | 'bottom';

/**
 * 스크롤 위치 및 방향을 반환
 */
export default function useScrollDirection() {
	const [scrollFlag, setScrollFlag] = useState<Flag>('top');
	const beforeScrollY = useRef(0);

	const updateScrollFlag = () => {
		const { scrollY } = window;
		// iOS elastic scrolling issue
		const screenHeight = window.innerHeight;
		const bodyHeight = document.body.scrollHeight;

		// 최상단
		if (scrollY == 0) {
			setScrollFlag('top');
		} else if (scrollY == bodyHeight - screenHeight) {
			setScrollFlag('bottom');
		} else if (beforeScrollY.current > scrollY) {
			setScrollFlag('up');
		} else {
			setScrollFlag('down');
		}

		beforeScrollY.current = scrollY;
	};

	useEffect(() => {
		updateScrollFlag();
		window.addEventListener('scroll', updateScrollFlag);
		return () => {
			window.removeEventListener('scroll', updateScrollFlag);
		};
	}, []);

	return scrollFlag;
}
