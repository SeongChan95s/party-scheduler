'use client';

import { FormHTMLAttributes, RefObject } from 'react';
import { FormProvider } from './FormProvider';
import { FormStore } from './useForm';
import { StoreApi } from 'zustand';

interface FormMainProps {
	id?: string;
	className?: string;
	store: StoreApi<FormStore>;
	children: React.ReactNode;
	onSubmit?: React.FormEventHandler;
	action?: (state: FormData) => void;
	ref?: RefObject<HTMLFormElement>;
	rest?: FormHTMLAttributes<HTMLFormElement>;
}

export default function FormMain({
	id,
	className,
	ref,
	store,
	action,
	onSubmit,
	children,
	...rest
}: FormMainProps) {
	return (
		<FormProvider store={store}>
			<form
				id={id}
				className={className}
				{...rest}
				action={action}
				onSubmit={onSubmit}
				ref={ref}>
				{children}
			</form>
		</FormProvider>
	);
}
