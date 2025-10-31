import { Link, Outlet } from 'react-router-dom';

export default function GuideLayout() {
	return (
		<div className="wrap">
			<h1>가이드 레이아웃</h1>
			<div>
				<Link to="/guide/basic">컴포넌트</Link>
				<Link to="/guide/popup">팝업</Link>
			</div>
			<Outlet />
		</div>
	);
}
