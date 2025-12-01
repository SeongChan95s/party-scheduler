import { TextField } from '../../../components/common/TextField';
import { Helmet } from 'react-helmet-async';
import { ButtonBar } from '../../../components/global/AppBar';
import { useForm } from 'react-hook-form';
import type { RegisterInput } from '../../../types/auth';
import { registerJoinInputSchema } from '../../../schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGlobalToastStore } from '../../../components/global/popup/GlobalToast';
import { useNavigate } from 'react-router-dom';
import { registerAuth } from '../../../services/auth/register';
import { useState } from 'react';
import type { BottomSheetState } from '@/components/common/BottomSheet/BottomSheet';
import { getFormatDate } from '@/utils/date';
import { DatePickerSheet } from '@/components/global/DatePickerSheet';
import { useLocalStorage } from '@/hooks/storage';
import 'react-datepicker/dist/react-datepicker.css';
import ImagePicker from '@/components/common/ImagePicker';

export default function JoinPage() {
	const navigate = useNavigate();
	const callbackStorage = useLocalStorage('callbackURL');

	const [datePickerState, setDatePickerState] = useState<{
		value: Date;
		state: BottomSheetState;
	}>({
		value: new Date(),
		state: 'closed'
	});

	const {
		register,
		formState: { errors },
		setValue,
		handleSubmit
	} = useForm<RegisterInput>({
		resolver: zodResolver(registerJoinInputSchema)
	});

	const onSubmit = async (data: RegisterInput) => {
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
				<title>가입정보 입력</title>
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

						<TextField
							className="mt-18"
							type="date"
							label="생년월일"
							error={errors.birth?.message}
							{...register('birth', { required: true })}
							fill
							element={
								<button
									type="button"
									onClick={() =>
										setDatePickerState(prev => ({ ...prev, state: 'expanded' }))
									}>
									날짜
								</button>
							}
						/>
						<TextField
							className="mt-18"
							type="tel"
							label="휴대폰 번호"
							fill
							error={errors.tel?.message}
							{...register('tel', { required: true })}
						/>
					</div>

					<ButtonBar type="submit">회원가입</ButtonBar>
				</form>

				<DatePickerSheet
					state={datePickerState.state}
					selected={datePickerState.value}
					onStateChange={value =>
						setDatePickerState(prev => ({
							...prev,
							state: value
						}))
					}
					onChange={value => {
						if (value) {
							setValue('birth', getFormatDate(value, 'YYYY-MM-DD'));
							setDatePickerState(() => ({
								state: 'closed',
								value
							}));
						}
					}}
				/>
			</main>
		</>
	);
}
