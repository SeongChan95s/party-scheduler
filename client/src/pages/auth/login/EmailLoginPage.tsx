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
import { FirebaseError } from 'firebase/app';

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
		try {
			await loginWithEmail(data.email, data.password);
			useGlobalToastStore.getState().push({
				message: '로그인에 성공했습니다.'
			});
		} catch (error) {
			if (error instanceof FirebaseError) {
				useGlobalToastStore.getState().push({
					message: error.message
				});
				navigate(callbackStorage.get() ?? '/');
			}
			if (error instanceof Error) throw error;
		}
	};

	return (
		<>
			<Helmet>
				<title>이메일 로그인</title>
			</Helmet>
			<main className="login-page mt-25 inner">
				<form onSubmit={handleSubmit(onSubmit)}>
					<ul>
						<li>
							<TextField
								label="이메일"
								placeholder="이메일을 입력해 주세요."
								size="lg"
								error={errors.email?.message}
								{...register('email')}
								fill
							/>
						</li>
						<li className="mt-18">
							<TextField
								type="password"
								label="비밀번호"
								placeholder="영문 숫자 조합 8자리 이상"
								size="lg"
								{...register('password')}
								error={errors.password?.message}
								fill
							/>
						</li>
					</ul>

					<div className="button-wrap mt-24">
						<Button type="submit" color="primary" fill>
							로그인
						</Button>
						<div className="flex gap-14 justify-between mt-15 text-label-2 text-gray-500">
							<Link to="/auth/register/agree">회원가입</Link>
							<Link to="#none">비밀번호 찾기</Link>
						</div>
					</div>
				</form>
			</main>
		</>
	);
}
