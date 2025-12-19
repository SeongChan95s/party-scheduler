import { TextField } from '../../../components/common/TextField';
import { Helmet } from 'react-helmet-async';
import { ButtonBar } from '../../../components/global/AppBar';
import { useForm } from 'react-hook-form';
import type { RegisterEmailCredentialInput } from '../../../types/auth';
import { registerJoinInputSchema } from '../../../schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGlobalToastStore } from '../../../components/global/Popup/GlobalToast';
import { useNavigate } from 'react-router-dom';
import { registerAuth } from '../../../services/auth/register';
import { useLocalStorage } from '@/hooks/storage';
import 'react-datepicker/dist/react-datepicker.css';
import { HTTPError } from '@/utils/HTTPError';
import { FirebaseError } from 'firebase/app';
import { ZodError } from 'zod';
import { Button } from '@/components/common/Button';

export default function JoinPage() {
	const navigate = useNavigate();
	const callbackStorage = useLocalStorage('callbackURL');

	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm<RegisterEmailCredentialInput>({
		resolver: zodResolver(registerJoinInputSchema)
	});

	console.log('errors', errors);

	const onSubmit = async (data: RegisterEmailCredentialInput) => {
		try {
			await registerAuth(data);
			useGlobalToastStore.getState().push({
				message: '회원가입에 성공했습니다.'
			});
			navigate(callbackStorage.get() ?? '/', { replace: true });
		} catch (error) {
			if (
				error instanceof FirebaseError ||
				error instanceof HTTPError ||
				error instanceof ZodError
			)
				return useGlobalToastStore.getState().push({
					message: error.message
				});
			if (error instanceof Error) throw error;
		}
	};

	return (
		<>
			<Helmet>
				<title>가입정보 입력</title>
			</Helmet>
			<main className="register-join-page flex-1">
				<form
					className="flex-1 flex flex-col justify-center items-center"
					name="registerJoin"
					onSubmit={handleSubmit(onSubmit)}>
					<ul>
						<li>
							<TextField
								label="이메일"
								error={errors.email?.message}
								fill
								{...register('email', { required: true })}
							/>
							<Button color="primary" fill>
								다음
							</Button>
						</li>
						<li>
							<TextField
								className="mt-18"
								type="password"
								label="비밀번호"
								fill
								error={errors.password?.message}
								{...register('password', { required: true })}
							/>
							<TextField
								className="mt-18"
								type="password"
								label="비밀번호 확인"
								fill
								error={errors.passwordConfirm?.message}
								{...register('passwordConfirm', { required: true })}
							/>
							<Button color="primary" fill>
								다음
							</Button>
						</li>
						<li>
							<TextField
								className="mt-18"
								label="닉네임"
								fill
								error={errors.displayName?.message}
								{...register('displayName', { required: true })}
							/>
							<Button type="submit" color="primary" fill>
								회원가입
							</Button>
						</li>
					</ul>
				</form>
			</main>
		</>
	);
}
