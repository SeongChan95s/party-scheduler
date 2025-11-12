import { useState, forwardRef } from 'react';
import styles from './StackField.module.scss';
import { IconClose, IconIncrease } from '../Icon';

interface StackFieldProps {
	value?: string[];
	defaultValue?: string[];
	onChange?: (value: string[]) => void;
	onBlur?: () => void;
	placeholder?: string;
	label?: string;
	name?: string;
	maxSize?: number;
}

const StackField = forwardRef<HTMLInputElement, StackFieldProps>(
	(
		{
			value: controlledValue,
			defaultValue,
			onChange,
			onBlur,
			placeholder = '',
			label,
			name,
			maxSize
		},
		ref
	) => {
		const [addMode, setAddMode] = useState(false);
		const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(
			defaultValue ?? []
		);
		const [valueToAdd, setValueToAdd] = useState('');

		const isControlled = controlledValue != undefined;

		const value = isControlled ? controlledValue : uncontrolledValue;
		const setValue = (value: string[]) => {
			onChange?.(value);
			if (!isControlled) setUncontrolledValue(value);
		};

		const handleAdd = () => {
			if (valueToAdd.length === 0) return;
			const newValue = [...value, valueToAdd];
			setValue(newValue);
			setValueToAdd('');
			setAddMode(false);
			onBlur?.();
		};

		const handleDelete = (item: string) => {
			const targetIndex = value.indexOf(item);
			const newValue = [...value.slice(0, targetIndex), ...value.slice(targetIndex + 1)];
			setValue(newValue);
			onBlur?.();
		};

		const handleCancel = () => {
			setAddMode(false);
			setValueToAdd('');
			onBlur?.();
		};

		return (
			<div className={styles.stackField}>
				{label && <h5>{label}</h5>}
				<ul className={styles.itemWrap}>
					{value &&
						Array.isArray(value) &&
						value.map(item => (
							<li className={styles.item} key={item}>
								<span>{item}</span>
								<IconClose size="sm" onClick={() => handleDelete(item)} />
							</li>
						))}
					{(maxSize === undefined || value.length < maxSize) && (
						<li
							className={`${styles.item} ${styles.itemToAdd} ${addMode && 'add-mode'}`}
							onClick={() => {
								setAddMode(true);
							}}>
							{!addMode ? (
								<IconIncrease size="sm" />
							) : (
								<>
									<input
										className={styles.inputField}
										value={valueToAdd}
										onChange={e => {
											setValueToAdd(e.target.value);
										}}
										onKeyDown={e => {
											if (e.key === 'Enter') {
												e.preventDefault();
												handleAdd();
											}
										}}
										placeholder={placeholder}
										autoFocus
									/>
									<IconIncrease
										onClick={e => {
											e.stopPropagation();
											handleAdd();
										}}
										size="sm"
									/>
									<IconClose
										onClick={e => {
											e.stopPropagation();
											handleCancel();
										}}
										size="sm"
									/>
								</>
							)}
						</li>
					)}
				</ul>
				<input name={name} value={JSON.stringify(value)} type="hidden" ref={ref} />
			</div>
		);
	}
);

export default StackField;
