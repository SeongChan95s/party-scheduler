import { Helmet } from 'react-helmet-async';

export default function HomePage() {
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
				</main>
			</div>
		</>
	);
}
