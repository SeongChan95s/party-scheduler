'use client';

import { useSelect } from './Select.hooks';

interface SelectOptionProps {
	value?: string;
	children: React.ReactNode;
	enableTextField?: boolean;
	disable?: boolean;
}

export default function SelectOption({
	value = '',
	children,
	enableTextField = false,
	disable = false
}: SelectOptionProps) {
	const { setValue, setIsFocused, setIsEntered, setEnableTextField } = useSelect();

	return (
		<li
			className={disable ? 'disable' : ''}
			onClick={() => {
				if (disable) return;
				// enableTextField prop에 따라 텍스트 입력 활성화
				if (enableTextField) {
					setEnableTextField?.(true);
					setValue('');
				} else {
					setValue(value);
					setEnableTextField?.(false);
				}
				setIsFocused(false);
				setIsEntered(true);
			}}>
			{children}
		</li>
	);
}
