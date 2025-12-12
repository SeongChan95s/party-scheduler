import { Outlet } from 'react-router-dom';
import { NavBar, TabBar } from '../components/global/Nav';

export default function MainLayout() {
	return (
		<>
			<NavBar />
			<Outlet />
			<TabBar />
		</>
	);
}
