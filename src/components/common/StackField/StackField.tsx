'use client';

import { useState, forwardRef } from 'react';
import { IconClose, IconIncrease } from '@/app/components/common/Icon';
import styles from './StackField.module.scss';

interface StackFieldProps {
	value?: string[];
	onChange?: (value: string[]) => void;
	onBlur?: () => void;
	placeholder?: string;
	label?: string;
	name?: string;
	maxSize?: number;
}

const StackField = forwardRef<HTMLInputElement, StackFieldProps>(
	({ value = [], onChange, onBlur, placeholder = '', label, name, maxSize }, ref) => {
		const [addMode, setAddMode] = useState(false);
		const [currentInputValue, setCurrentInputValue] = useState('');

		const handleAdd = () => {
			if (currentInputValue.length === 0) return;
			const newValue = [...value, currentInputValue];
			onChange?.(newValue);
			setCurrentInputValue('');
			setAddMode(false);
			onBlur?.();
		};

		const handleDelete = (item: string) => {
			const targetIndex = value.indexOf(item);
			const newValue = [...value.slice(0, targetIndex), ...value.slice(targetIndex + 1)];
			onChange?.(newValue);
			onBlur?.();
		};

		const handleCancel = () => {
			setAddMode(false);
			setCurrentInputValue('');
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
							className={`${styles.item} ${styles.itemToAdd} ${addMode && 'addMode'}`}
							onClick={() => {
								setAddMode(true);
							}}>
							{!addMode ? (
								<IconIncrease size="sm" />
							) : (
								<>
									<input
										className={styles.inputField}
										value={currentInputValue}
										onChange={e => {
											setCurrentInputValue(e.target.value);
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

StackField.displayName = 'StackField';

export default StackField;
