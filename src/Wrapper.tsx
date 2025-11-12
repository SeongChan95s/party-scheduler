import { useEffect, useMemo, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { create } from 'zustand';
import GlobalToast from './components/global/popup/GlobalToast';
import GlobalDialog from './components/global/popup/GlobalDialog';

interface useLayoutStore {
	layoutWidth: number;
	setLayoutWidth: (value: number) => void;
}

export const useLayoutStore = create<useLayoutStore>()(set => ({
	layoutWidth: 0,
	setLayoutWidth: value => {
		set({ layoutWidth: value });
	}
}));

export default function Wrapper() {
	const layoutRef = useRef<HTMLDivElement>(null);
	const setLayoutWidth = useLayoutStore(state => state.setLayoutWidth);

	useEffect(() => {
		const handleLayoutWidth = () => {
			if (layoutRef.current) {
				const rect = layoutRef.current.getBoundingClientRect();
				setLayoutWidth(rect.width);
			}
		};

		handleLayoutWidth();

		window.addEventListener('resize', handleLayoutWidth);
		return () => window.removeEventListener('resize', handleLayoutWidth);
	}, []);

	const { pathname } = useLocation();

	const layoutId = useMemo(() => {
		if (pathname.includes('admin')) return 'desktopLayout';
		return 'mobileLayout';
	}, [pathname.includes('admin')]);

	return (
		<div id={layoutId} className="commonContainer" ref={layoutRef}>
			<Outlet />
			<GlobalDialog />
			<GlobalToast />
		</div>
	);
}
