import { TextField } from '../../../components/common/TextField';
import { Helmet } from 'react-helmet-async';
import { ButtonBar } from '../../../components/global/AppBar';
import { useForm } from 'react-hook-form';
import type { RegisterJoinInput } from '../../../types/auth';
import { registerJoinInputSchema } from '../../../schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGlobalToastStore } from '../../../components/global/popup/GlobalToast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { registerAuth } from '../../../services/auth/register';

export default function RegisterJoin() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const {
		register,
		formState: { errors },
		handleSubmit
	} = useForm<RegisterJoinInput>({
		resolver: zodResolver(registerJoinInputSchema)
	});

	const onSubmit = async (data: RegisterJoinInput) => {
		const result = await registerAuth(data);

		if (result)
			useGlobalToastStore.getState().push({
				message: result.message
			});

		if (result?.success) {
			const callbackUrl = searchParams.get('callbackUrl') ?? '/';
			navigate(callbackUrl);
		}
	};

	return (
		<>
			<Helmet>
				<title>파티 스케줄러 : 가입정보 입력</title>
			</Helmet>
			<main className="register-join-page">
				<form
					className="flex-1 flex flex-col justify-center items-center"
					name="registerJoin"
					onSubmit={handleSubmit(onSubmit)}>
					<div className="p-24 border border-gray-200 rounded-xl">
						<TextField
							label="이메일"
							error={errors.email?.message}
							{...register('email', { required: true })}
						/>
						<TextField
							className="mt-18"
							type="password"
							label="비밀번호"
							error={errors.password?.message}
							{...register('password', { required: true })}
						/>
						<TextField
							className="mt-18"
							label="닉네임"
							error={errors.displayName?.message}
							{...register('displayName', { required: true })}
						/>
						<TextField
							className="mt-18"
							type="date"
							label="생년월일"
							error={errors.birth?.message}
							{...register('birth', { required: true })}
							fill
						/>
						<TextField
							className="mt-18"
							type="tel"
							label="휴대폰 번호"
							error={errors.phone?.message}
							{...register('phone', { required: true })}
						/>
					</div>
					<ButtonBar type="submit">회원가입</ButtonBar>
				</form>
			</main>
		</>
	);
}
