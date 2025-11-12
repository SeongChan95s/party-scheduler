import { Outlet } from 'react-router-dom';
import GuideNavBar from '../components/guide/GuideNavBar';

export default function GuideLayout() {
	return (
		<div className="min-w-350 max-w-750 layout-width">
			<GuideNavBar />
			<Outlet />
		</div>
	);
}
