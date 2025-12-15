import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage } from '@/hooks/storage';
import { Button } from '@/components/common/Button';
import type { LoginInput } from '@/types/auth';
import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';
import { TextField } from '@/components/common/TextField';
import { loginInputSchema } from '@/schemas/auth';
import { loginWithEmail } from '@/services/auth/loginWithEmail';

export default function EmailLoginPage() {
	const navigate = useNavigate();
	const callbackStorage = useLocalStorage<string>('callbackURL');

	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm<LoginInput>({
		resolver: zodResolver(loginInputSchema)
	});

	const onSubmit = async (data: LoginInput) => {
		const result = await loginWithEmail(data.email, data.password);
		if (result) {
			useGlobalToastStore.getState().push({
				message: result.message
			});
		}

		if (result?.success) {
			navigate(callbackStorage.get() ?? '/');
		}
	};

	return (
		<>
			<Helmet>
				<title>로그인 - 이메일</title>
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
								<Link to="/auth/register/agree">회원가입</Link>
								<Link to="#none">비밀번호 찾기</Link>
							</div>
						</div>
					</div>
				</form>
			</main>
		</>
	);
}
