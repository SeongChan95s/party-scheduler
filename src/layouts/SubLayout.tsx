import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/global/Nav';

export default function SubLayout() {
	return (
		<>
			<NavBar />
			<Outlet />
		</>
	);
}
