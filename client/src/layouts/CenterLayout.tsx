import { NavBar } from '@/components/global/Nav';
import { Outlet } from 'react-router-dom';

export default function CenterLayout() {
	return (
		<>
			<NavBar />
			<div className="flex-1 flex flex-col justify-center items-center">
				<Outlet />
			</div>
		</>
	);
}
