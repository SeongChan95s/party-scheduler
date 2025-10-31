import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function AboutPage() {
	return (
		<>
			<Helmet>
				<title>이런저런</title>
			</Helmet>
			<div>
				<h1>About 페이지</h1>
				<p>파일 시스템 기반 라우팅으로 생성된 About 페이지입니다.</p>
				<Link to="/">홈으로 돌아가기</Link>
			</div>
		</>
	);
}
