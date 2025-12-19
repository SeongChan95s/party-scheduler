import { TextField } from '../../../components/common/TextField';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import type { RegisterEmailCredentialInput } from '../../../types/auth';
import { registerJoinInputSchema } from '../../../schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGlobalToastStore } from '../../../components/global/Popup/GlobalToast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { registerAuth } from '../../../services/auth/register';
import { useLocalStorage } from '@/hooks/storage';
import { HTTPError } from '@/utils/HTTPError';
import { FirebaseError } from 'firebase/app';
import { ZodError } from 'zod';
import { Button } from '@/components/common/Button';
import { useEffect, useRef } from 'react';
import { handleFirebaseAuthErrorMessage } from '@/utils/auth';
import { auth } from '@/lib/firebase/config';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { Spinner } from '@/components/common/Spinner';

export default function JoinPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const step = parseInt(searchParams.get('step') ?? '1', 10);
	const callbackStorage = useLocalStorage('callbackURL');
	const nodeRef1 = useRef<HTMLUListElement>(null);
	const nodeRef2 = useRef<HTMLUListElement>(null);
	const nodeRef3 = useRef<HTMLUListElement>(null);
	const nodeRef = step === 1 ? nodeRef1 : step === 2 ? nodeRef2 : nodeRef3;

	const {
		register,
		formState: { errors, isSubmitting },
		handleSubmit,
		trigger,
		getValues,
		setError
	} = useForm<RegisterEmailCredentialInput>({
		resolver: zodResolver(registerJoinInputSchema)
	});

	useEffect(() => {
		if (step === 1) return;
		const values = getValues();
		if (step > 1 && !values.email) {
			navigate(`?step=1`, { replace: true });
			return;
		}
		if (step > 2 && (!values.password || !values.passwordConfirm)) {
			navigate(`?step=2`, { replace: true });
			return;
		}
	}, [step, navigate, getValues]);

	const handleNext = async (fields: (keyof RegisterEmailCredentialInput)[]) => {
		const result = await trigger(fields);
		if (result) {
			navigate(`?step=${step + 1}`);
		}
	};

	const onSubmit = async (data: RegisterEmailCredentialInput) => {
		try {
			await registerAuth(data);
			useGlobalToastStore.getState().push({
				message: '회원가입에 성공했습니다.'
			});
			navigate(callbackStorage.get() ?? '/', { replace: true });
		} catch (error) {
			if (error instanceof FirebaseError)
				return useGlobalToastStore.getState().push({
					message: handleFirebaseAuthErrorMessage(error)
				});

			if (error instanceof HTTPError || error instanceof ZodError)
				return useGlobalToastStore.getState().push({
					message: error.message
				});
			if (error instanceof Error) throw error;
		}
	};

	const handleEmailValidate = async () => {
		const isValid = await trigger('email');
		if (!isValid) return;

		const email = getValues('email');

		try {
			const signInMethods = await fetchSignInMethodsForEmail(auth, email);
			if (signInMethods.length > 0) {
				setError('email', {
					message: '이미 존재하는 이메일입니다.'
				});
				return;
			}

			navigate(`?step=${step + 1}`);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<Helmet>
				<title>가입정보 입력</title>
			</Helmet>
			<main className="register-join-page flex-1">
				<form name="registerJoin" onSubmit={handleSubmit(onSubmit)}>
					<div className="pt-24 inner">
						<SwitchTransition>
							<CSSTransition key={step} nodeRef={nodeRef} classNames="fade" timeout={300}>
								<ul ref={nodeRef}>
									{step === 1 && (
										<li>
											<TextField
												label="이메일"
												error={errors.email?.message}
												fill
												{...register('email', { required: true })}
											/>
											<Button
												className="mt-24"
												type="button"
												color="primary"
												fill
												onClick={handleEmailValidate}>
												다음
											</Button>
										</li>
									)}
									{step === 2 && (
										<li>
											<TextField
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
											<Button
												className="mt-24"
												type="button"
												color="primary"
												fill
												onClick={() => handleNext(['password', 'passwordConfirm'])}>
												다음
											</Button>
										</li>
									)}
									{step === 3 && (
										<li>
											<TextField
												label="닉네임"
												fill
												error={errors.displayName?.message}
												{...register('displayName', { required: true })}
											/>
											<Button className="mt-24" type="submit" color="primary" fill>
												{isSubmitting ? <Spinner size="xs" /> : '회원가입'}
											</Button>
										</li>
									)}
								</ul>
							</CSSTransition>
						</SwitchTransition>
					</div>
				</form>
			</main>
		</>
	);
}
