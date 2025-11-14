import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { TextField } from '../../components/common/TextField';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginInputSchema } from '../../schemas/auth';
import type { LoginInput } from '../../types/auth';
import { loginAuth } from '../../services/auth/login';
import { useGlobalToastStore } from '../../components/global/popup/GlobalToast';
import { checkAuth } from '../../utils/auth';
import { useEffect } from 'react';

export default function Login() {
	const navigate = useNavigate();

	useEffect(() => {
		const checkLoginStatus = async () => {
			const user = await checkAuth();

			if (user) {
				useGlobalToastStore.getState().push({
					message: '이미 로그인 중입니다.'
				});
				navigate(-1);
			}
		};

		checkLoginStatus();
	}, []);

	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm<LoginInput>({
		resolver: zodResolver(loginInputSchema)
	});

	const onSubmit = async (data: LoginInput) => {
		const result = await loginAuth(data.email, data.password);

		if (result)
			useGlobalToastStore.getState().push({
				message: result.message
			});
	};

	return (
		<>
			<Helmet>
				<title>로그인</title>
			</Helmet>
			<main className="login-page">
				<form
					className="flex-1 flex flex-col justify-center items-center"
					onSubmit={handleSubmit(onSubmit)}>
					<div>
						<ul>
							<li>
								<TextField
									variant="dynamic"
									label="이메일"
									error={errors.email?.message}
									{...register('email')}
								/>
							</li>
							<li className="mt-18">
								<TextField
									type="password"
									variant="dynamic"
									label="패스워드"
									{...register('password')}
									error={errors.password?.message}
								/>
							</li>
						</ul>

						<div className="button-wrap mt-24">
							<Button className="w-full!" type="submit" color="primary">
								로그인
							</Button>
							<div className="flex gap-14 justify-between mt-15 text-label-2 text-gray-500">
								<div className="flex items-center">
									<Link to="#none">아이디</Link>
									<span>&nbsp;/&nbsp;</span>
									<Link to="#none">비밀번호</Link>
									<span>&nbsp;찾기</span>
								</div>
								<Link to="/auth/register/agree?callbackUrl='/auth/login'">회원가입</Link>
							</div>
						</div>
					</div>
				</form>
			</main>
		</>
	);
}
