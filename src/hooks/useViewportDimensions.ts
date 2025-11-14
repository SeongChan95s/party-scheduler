import { useEffect, useState } from 'react';

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
