import { useSelect } from './Select.hooks';
import styles from './Select.module.scss';

interface SelectOptionProps {
	children: string;
	enableTextField?: boolean;
	disabled?: boolean;
}

export default function SelectOption({
	children,
	enableTextField = false,
	disabled = false
}: SelectOptionProps) {
	const { setValue, setIsFocused, setIsEntered, setEnableTextField } = useSelect();

	return (
		<li
			className={disabled ? styles.disabled : ''}
			onClick={() => {
				if (disabled) return;
				if (enableTextField) {
					setEnableTextField?.(true);
					setValue('');
				} else {
					setValue(children);
					setEnableTextField?.(false);
				}
				setIsFocused(false);
				setIsEntered(true);
			}}>
			{children}
		</li>
	);
}
