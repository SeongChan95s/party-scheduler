import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import GlobalToast from './components/global/Popup/GlobalToast';
import GlobalDialog from './components/global/Popup/GlobalDialog';
import { useUserStateChanged } from './hooks/auth/useUserStateChanged';

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

export default function Wrapper({ children }: { children: React.ReactNode }) {
	const layoutRef = useRef<HTMLDivElement>(null);
	const setLayoutWidth = useLayoutStore(state => state.setLayoutWidth);
	useUserStateChanged();

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

	return (
		<div className="wrapper" ref={layoutRef}>
			{children}
			<GlobalDialog />
			<GlobalToast />
		</div>
	);
}
