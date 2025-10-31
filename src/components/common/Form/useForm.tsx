import { useRef } from 'react';
import { createStore } from 'zustand';
import { FormContext } from './FormProvider';
import { useInitStore } from '@/app/hooks';

export interface FormStore {
	formData: { [key: string]: string };
	setFormData: (value: object) => void;
	validateResult: { [key: string]: boolean };
	setValidateResult: (value: object) => void;
}

function useCreateFormStore() {
	const formStore = createStore<FormStore>(set => ({
		formData: {},
		setFormData: value => {
			set(store => ({ formData: { ...store.formData, ...value } }));
		},
		validateResult: {},
		setValidateResult: value => {
			set(store => ({ validateResult: { ...store.validateResult, ...value } }));
		}
	}));
	const store = useRef(formStore).current;

	return store;
}

function useFormStore<U = FormStore>(selector: (state: FormStore) => U) {
	return useInitStore(FormContext, selector);
}

export { useCreateFormStore, useFormStore };
