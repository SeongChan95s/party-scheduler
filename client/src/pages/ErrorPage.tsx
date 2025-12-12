import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function ErrorPage() {
	const error = useRouteError();

	return (
		<>
			<Helmet>
				<title>에러 - 파티 스케줄러</title>
				<meta name="description" content="페이지를 찾을 수 없습니다" />
			</Helmet>
			<div>
				<h1>예상치 못한 에러가 발생했습니다.</h1>

				{isRouteErrorResponse(error) ? (
					<div>
						<p>{error.status}</p>
						<p>{error.statusText}</p>
					</div>
				) : (
					<p>알수없는 에러</p>
				)}
			</div>
		</>
	);
}
