import { useState } from 'react';
import styles from './Switch.module.scss';

interface SwitchProps {
	id?: string;
	className?: string;
	name?: string;
	color?: 'normal' | 'primary';
	size?: 'sm' | 'md';
	checked?: boolean;
	defaultChecked?: boolean;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	children?: React.ReactNode;
	rest?: React.HTMLAttributes<HTMLDivElement>;
}

export default function Switch({
	id,
	className,
	name,
	color = 'normal',
	size = 'md',
	checked: controlledChecked,
	defaultChecked = false,
	onChange,
	children,
	...rest
}: SwitchProps) {
	const [uncontrolledChecked, setUncontrolledChecked] = useState<boolean>(defaultChecked);

	const isControlled = controlledChecked != undefined;
	const checked = isControlled ? controlledChecked : uncontrolledChecked;

	const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isControlled) setUncontrolledChecked(e.target.checked);
		onChange?.(e);
	};

	return (
		<div
			className={`${styles.switch} ${styles[color]} ${styles[size]} ${className}`}
			{...rest}>
			<label htmlFor={id}>
				<input
					type="checkbox"
					className={`${styles.input} hidden`}
					checked={checked}
					name={name}
					onChange={handleChecked}
				/>
				<div className={styles.button}>
					<span className={styles.circle}></span>
				</div>
				<span className={styles.label}>{children}</span>
			</label>
		</div>
	);
}
