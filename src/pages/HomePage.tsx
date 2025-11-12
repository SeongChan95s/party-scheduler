import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { IconAlertFilled } from '../components/common/Icon';

export default function HomePage() {
	return (
		<>
			<Helmet>
				<title>파티 스케줄러</title>
				<meta name="description" content="파티 일정을 쉽게 관리하세요" />
			</Helmet>
			<div>
				<p className="bg-blue-100">홈페이지</p>
				<div className="flex items-center">
					<IconAlertFilled />
					<h2 className="text-headline-1">템플릿</h2>
				</div>
				<nav>
					<ul>
						<li>
							<Link to="/about">About 페이지</Link>
						</li>
						<li>
							<Link to="/user">User 페이지</Link>
						</li>
						<li>
							<Link to="/guide/common/component">Guide 페이지</Link>
						</li>
						<li>
							<Link to="/user/123">User Detail (123)</Link>
						</li>
					</ul>
				</nav>
			</div>
		</>
	);
}
