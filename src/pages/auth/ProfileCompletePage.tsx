import type { BottomSheetState } from '@/components/common/BottomSheet/BottomSheet';
import { Button } from '@/components/common/Button';
import { TextField } from '@/components/common/TextField';
import { DatePickerSheet } from '@/components/global/DatePickerSheet';
import { useUserState } from '@/hooks/auth/useUserStateChanged';
import { db } from '@/lib/firebase/config';
import { registerProfileSchema } from '@/schemas/auth';
import type { RegisteProfileSchema } from '@/types/auth';
import { getFormatDate } from '@/utils/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { omit } from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ProfileCompletePage() {
	const location = useLocation();
	const navigate = useNavigate();
	const [profileToAdd, setProfileToAdd] = useState<string[]>();
	const [datePickerState, setDatePickerState] = useState<{
		value: Date;
		state: BottomSheetState;
	}>({
		value: new Date(),
		state: 'closed'
	});

	useEffect(() => {
		const result = registerProfileSchema.safeParse(location.state);
		if (!result.error) {
			navigate('/');
			return;
		}
		const errorData = result.error.issues.flatMap(el => el.path) as string[];
		setProfileToAdd(errorData);
	}, []);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors }
	} = useForm<RegisteProfileSchema>({
		defaultValues: {
			...location.state
		},
		resolver: zodResolver(registerProfileSchema)
	});

	const onSubmit = async (formData: RegisteProfileSchema) => {
		try {
			await setDoc(doc(db, 'users', location.state.id), {
				...omit(location.state, 'id'),
				...formData
			});

			let user = useUserState.getState().user;

			if (user) {
				await updateEmail(user, formData.email);
			}

			// firebase auth에 추가해야함
		} catch (error) {
			throw error;
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				{profileToAdd?.map(field => {
					switch (field) {
						case 'email':
							return (
								<TextField
									key={field}
									label="이메일"
									error={errors.email?.message}
									fill
									{...register('email', { required: true })}
								/>
							);

						case 'displayName':
							return (
								<TextField
									key={field}
									className="mt-18"
									label="닉네임"
									fill
									error={errors.displayName?.message}
									{...register('displayName', { required: true })}
								/>
							);

						case 'birth':
							return (
								<TextField
									key={field}
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
							);

						case 'tel':
							return (
								<TextField
									key={field}
									className="mt-18"
									type="tel"
									label="휴대폰 번호"
									fill
									error={errors.tel?.message}
									{...register('tel', { required: true })}
								/>
							);
					}
				})}
				가입 페이지<Button type="submit">제출</Button>
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
		</div>
	);
}
