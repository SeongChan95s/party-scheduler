import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Home() {
	return (
		<>
			<Helmet>
				<title>파티 스케줄러</title>
				<meta name="description" content="파티 일정을 쉽게 관리하세요" />
			</Helmet>
			<div className="home-page">
				<main>
					<div className="flex items-center">
						<h2 className="text-headline-1">홈 페이지</h2>
					</div>
					<Link to="/training">연습장</Link>
					<Link to="/guide/common/component">가이드</Link>
				</main>
			</div>
		</>
	);
}
