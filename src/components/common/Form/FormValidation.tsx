'use client';

import { useEffect } from 'react';
import { IconCheck } from '../Icon';
import { useFormStore } from './useForm';
import styles from './Form.module.scss';

interface FormValidationProps {
	label?: string;
	name: string;
	defaultValue?: string;
	isValidated?: boolean;
	onValidate: (value: string) => boolean;
	isHidden?: boolean;
}

export default function FormValidation({
	label = '유효성 검사',
	name,
	defaultValue = '',
	onValidate,
	isHidden = false
}: FormValidationProps) {
	const value = useFormStore(state => state.formData[name]) ?? defaultValue;
	const validateResult = onValidate(value);
	const isValidatedClass = validateResult ? styles.isValidated : '';
	const setValidateResult = useFormStore(state => state.setValidateResult);

	useEffect(() => {
		setValidateResult({ [name]: validateResult });
	}, [value]);

	if (isHidden) return <></>;

	return (
		<div className={`${styles.formValidation} ${isValidatedClass}`}>
			<IconCheck className={styles.checkIcon} />
			<p className={styles.label}>{label}</p>
		</div>
	);
}
