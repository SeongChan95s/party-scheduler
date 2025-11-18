import { Helmet } from 'react-helmet-async';
import { Button } from '../../components/common/Button';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '../../hooks/auth/useUserStateChanged';

export default function My() {
	const navigate = useNavigate();

	const user = useUserState(state => state.user);

	const handleLogin = async () => {
		navigate('/auth/login?callbackUrl=/my');
	};

	const handleLogout = async () => {
		const auth = getAuth();
		await signOut(auth);
	};

	return (
		<>
			<Helmet>
				<title>파티 스케줄러 - 마이페이지</title>
			</Helmet>
			<div className="my-page">
				<div>내용</div>
				{user ? (
					<Button onClick={handleLogout}>로그아웃</Button>
				) : (
					<Button onClick={handleLogin}>로그인</Button>
				)}
			</div>
		</>
	);
}
