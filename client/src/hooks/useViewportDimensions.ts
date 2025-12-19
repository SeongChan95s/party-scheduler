import { useEffect, useState } from 'react';

/**
 * 뷰포트 사이즈를 반환
 */
export default function useViewportDimensions() {
	const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const handleResize = () => {
			const { innerWidth: width, innerHeight: height } = window;
			setViewportDimensions({ width, height });
		};
		handleResize();

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return viewportDimensions;
}
