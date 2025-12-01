import { Helmet } from 'react-helmet-async';
import { Button } from '../../components/common/Button';
import { getAuth, signOut } from 'firebase/auth';
import { useUserState } from '../../hooks/auth/useUserStateChanged';
import { useLogin } from '@/hooks/auth/useLogin';

export default function MyPage() {
	const login = useLogin();

	const user = useUserState(state => state.user);

	const logout = async () => {
		const auth = getAuth();
		await signOut(auth);
	};

	return (
		<>
			<Helmet>
				<title>파티 스케줄러 - 마이</title>
			</Helmet>
			<div className="my-page">
				<div>{user?.displayName} 님 로그인을 환영합니다.</div>
				{user ? (
					<Button onClick={logout}>로그아웃</Button>
				) : (
					<Button onClick={login}>로그인</Button>
				)}
			</div>
		</>
	);
}
