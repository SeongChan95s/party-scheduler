import { Outlet } from 'react-router-dom';
import GuideNavBar from '../components/guide/GuideNavBar';
import { Suspense } from 'react';

export default function GuideLayout() {
	return (
		<div className="min-w-350 max-w-750 layout-width">
			<Suspense fallback={<div>로딩중...</div>}>
				<GuideNavBar />
				<Outlet />
			</Suspense>
		</div>
	);
}
