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
import ImagePicker from '@/components/common/ImagePicker';

export default function JoinPage() {
	const navigate = useNavigate();
	const callbackStorage = useLocalStorage('callbackURL');

	const {
		register,
		formState: { errors },
		setValue,
		handleSubmit
	} = useForm<RegisterEmailCredentialInput>({
		resolver: zodResolver(registerJoinInputSchema)
	});

	const onSubmit = async (data: RegisterEmailCredentialInput) => {
		const result = await registerAuth(data);

		if (result)
			useGlobalToastStore.getState().push({
				message: result.message
			});

		if (result?.success) {
			navigate(callbackStorage.get() ?? '/');
		}
	};

	return (
		<>
			<Helmet>
				<title>회원가입 - 가입정보 입력</title>
			</Helmet>
			<main className="register-join-page flex-1">
				<form
					className="flex-1 flex flex-col justify-center items-center"
					name="registerJoin"
					onSubmit={handleSubmit(onSubmit)}>
					<div className="p-24 border border-gray-200 rounded-xl">
						<TextField
							label="이메일"
							error={errors.email?.message}
							fill
							{...register('email', { required: true })}
						/>
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
							label="닉네임"
							fill
							error={errors.displayName?.message}
							{...register('displayName', { required: true })}
						/>
						<ImagePicker
							maxCount={1}
							onChange={file => setValue('photoFiles', file)}
							onMetadataChange={data => setValue('photoMetadata', data)}
						/>
					</div>

					<ButtonBar type="submit">회원가입</ButtonBar>
				</form>
			</main>
		</>
	);
}
