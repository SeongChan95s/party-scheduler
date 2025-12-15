import { Outlet } from 'react-router-dom';

export default function CenterLayout() {
	return (
		<div className="center-layout flex-1 flex justify-center items-center">
			<Outlet />
		</div>
	);
}
