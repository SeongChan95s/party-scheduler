import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
	loginWithKakao,
	loginWithNaver,
	loginWithGoogle,
	loginWithTwitter
} from '@/services/auth/oauth';
import { Button } from '@/components/common/Button';

export default function LoginPage() {
	const navigate = useNavigate();

	return (
		<>
			<Helmet>
				<title>모요(Moyo) - 로그인</title>
			</Helmet>
			<main className="login-page flex flex-col gap-12">
				<Button onClick={async () => await loginWithGoogle()}>구글 로그인</Button>
				<Button onClick={async () => await loginWithKakao()}>카카오 로그인</Button>
				<Button onClick={async () => await loginWithNaver()}>네이버 로그인</Button>
				<Button onClick={async () => await loginWithTwitter()}>X (트위터) 로그인</Button>
				<Button onClick={() => navigate('email')}>이메일 로그인</Button>
			</main>
		</>
	);
}
