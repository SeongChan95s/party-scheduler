import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/common/Nav';

export default function MainLayout() {
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	);
}
