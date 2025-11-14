import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

export default function Detail() {
	const { id } = useParams<{ id: string }>();

	return (
		<>
			<Helmet>
				<title>{id}번째 상세 페이지</title>
			</Helmet>
			<div>
				<h2>상세 페이지의 본문입니다.</h2>
				<p>ID: {id}</p>
			</div>
		</>
	);
}
