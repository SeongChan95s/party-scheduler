import { IconClose } from '../Icon';
import { IconButton } from '../IconButton';
import { useRef, useState, useEffect, forwardRef } from 'react';
import { IconIncrease } from '../Icon';
import { classNames } from '../../../utils/classNames';
import { getFileFormat } from '../../../utils/getFileFormat';
import 'swiper/swiper-bundle.css';
import styles from './ImagePicker.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';

const acceptExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

interface ImageUploadInputProps {
	disabled?: boolean;
	onAddFile: (files: FileList) => void;
}

function ImageUploadInput({ disabled = false, onAddFile }: ImageUploadInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [dragOver, setDragOver] = useState(false);

	return (
		<div
			className={classNames(styles.uploadInput, styles.item, dragOver && 'drag-over')}
			onDragOver={e => {
				e.preventDefault();
				const isExistImage = e.dataTransfer.types.includes('text/plain');
				if (!isExistImage && e.dataTransfer.types.includes('Files')) {
					setDragOver(true);
				}
			}}
			onDragLeave={() => setDragOver(false)}
			onDrop={e => {
				e.preventDefault();
				setDragOver(false);
				const isExistImage = e.dataTransfer.getData('text/plain') === 'exist-images';
				if (!disabled && !isExistImage && e.dataTransfer.files.length > 0) {
					onAddFile(e.dataTransfer.files);
				}
			}}
			onClick={() => !disabled && inputRef.current?.click()}>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				multiple
				onChange={e => {
					if (!disabled && e.target.files) onAddFile(e.target.files);
				}}
				disabled={disabled}
			/>
			<IconIncrease />
		</div>
	);
}

export interface ImagePickerBase {
	key: string;
	file: File | null;
	blob: string;
	state: 'initial' | 'upload' | 'delete';
}

export type ImagePickerItem =
	| (ImagePickerBase & { state: 'initial' | 'delete'; file: null })
	| (ImagePickerBase & { state: 'upload'; file: File });

interface ImagePickerProps {
	className?: string;
	name?: string;
	value?: ImagePickerItem[];
	baseKey?: string;
	defaultValue?: ImagePickerItem[];
	maxCount?: number;
	maxSizeMB?: number;
	acceptExts?: string[];
	swiper?: boolean;
	dragdrop?: boolean;
	form?: string;
	onInitial?: (value: ImagePickerItem[]) => void;
	onChange?: (value: ImagePickerItem[]) => void;
	onFilesChange?: (files: File[]) => void;
}

const ImagePicker = forwardRef<HTMLInputElement, ImagePickerProps>(function ImagePicker(
	{
		className: classNameProp,
		name,
		value: controlledValue,
		defaultValue = [],
		maxCount,
		maxSizeMB = 5,
		swiper = false,
		dragdrop = true,
		form,
		onInitial,
		onChange,
		onFilesChange
	},
	ref
) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [uncontrolledValue, setUncontrolledValue] =
		useState<ImagePickerItem[]>(defaultValue);
	const isControlled = controlledValue != undefined;
	const value = isControlled ? controlledValue : uncontrolledValue;

	const setValue = (value: ImagePickerItem[]) => {
		if (!isControlled) setUncontrolledValue(value);
		onChange?.(value);

		// 파일 변경 시 onFilesChange 콜백 호출
		const uploadFiles = value
			.filter(img => img.state === 'upload' && img.file)
			.map(img => img.file!)
			.filter(Boolean);
		onFilesChange?.(uploadFiles);
	};

	const [dragIdx, setDragIdx] = useState<number | null>(null);

	useEffect(() => {
		onInitial?.(value);
	}, []);

	const setFileInputRef = (element: HTMLInputElement | null) => {
		fileInputRef.current = element;
		if (element) {
			const dataTransfer = new DataTransfer();
			value
				.filter(img => img.state === 'upload' && img.file)
				.forEach(img => {
					if (img.file) {
						dataTransfer.items.add(img.file);
					}
				});
			element.files = dataTransfer.files;
		}
	};

	const handleDragOver = (from: number | null, to: number) => (e: React.DragEvent) => {
		e.preventDefault();

		if (dragdrop && from !== null && from !== to) {
			const arr = value.filter(img => img.state !== 'delete');
			const [moved] = arr.splice(from, 1);
			arr.splice(to, 0, moved);

			const result: ImagePickerItem[] = [];
			let reorderIdx = 0;
			for (let i = 0; i < value.length; i++) {
				if (value[i].state === 'delete') {
					result.push(value[i]);
				} else {
					result.push(arr[reorderIdx++]);
				}
			}
			setValue?.(result);
			setDragIdx(to);
		}
	};

	const dragOverOpacity = (i: number) => ({
		opacity: dragIdx === i ? 0.5 : 1
	});

	const updateFileInput = (currentImages?: ImagePickerItem[]) => {
		if (!fileInputRef.current) return;

		const imagesToUse = currentImages || value;
		const dataTransfer = new DataTransfer();
		imagesToUse
			.filter(img => img.state === 'upload' && img.file)
			.forEach(img => {
				if (img.file) {
					dataTransfer.items.add(img.file);
				}
			});
		fileInputRef.current.files = dataTransfer.files;
	};

	const handleAddFiles = (files: FileList) => {
		const arr = Array.from(files);
		const currentCount = value.filter(img => img.state !== 'delete').length;
		if (maxCount && currentCount + arr.length > maxCount) return;

		// 유효성 검사
		const validFiles = arr.filter(file => {
			const ext = getFileFormat(file.name).toLowerCase();
			const sizeMB = file.size / 1024 / 1024;
			return acceptExts.includes(ext) && sizeMB <= maxSizeMB;
		});

		// 중복체크
		const nonDuplicateFiles = validFiles.filter(file => {
			const fileIdentifier = `${file.name}_${file.size}`;
			return !value.some(img => {
				if (img.state === 'delete') return false;
				if (img.file) {
					const existingIdentifier = `${img.file.name}_${img.file.size}`;
					return existingIdentifier === fileIdentifier;
				}
				return false;
			});
		});

		const addedImages: ImagePickerItem[] = nonDuplicateFiles.map(file => {
			return {
				key: file.name,
				file,
				blob: window.URL.createObjectURL(file),
				state: 'upload'
			};
		});

		const newImages = [...value, ...addedImages];
		setValue?.(newImages);
		setTimeout(() => updateFileInput(newImages), 0);
	};

	const handleDelete = (idx: number) => {
		const img = value[idx];
		let newImages: ImagePickerItem[];

		if (img.state === 'initial') {
			newImages = value.map((v, i) =>
				i === idx ? { ...v, state: 'delete', file: null } : v
			);
		} else {
			newImages = [...value.slice(0, idx), ...value.slice(idx + 1)];
		}

		setValue?.(newImages);
		setTimeout(() => updateFileInput(newImages), 0);
	};

	const canAdd =
		!maxCount || value.filter(img => img.state !== 'delete').length < maxCount;

	const className = classNames(
		styles.imagePicker,
		swiper && styles.swiper,
		classNameProp
	);

	const visibleImages = value.filter(img => img.state !== 'delete');

	return (
		<div className={className}>
			{swiper ? (
				<Swiper className={styles.imageWrap} slidesPerView="auto">
					{canAdd && (
						<SwiperSlide className={styles.item}>
							<ImageUploadInput disabled={!canAdd} onAddFile={handleAddFiles} />
						</SwiperSlide>
					)}
					{visibleImages.map((image, i) => (
						<SwiperSlide className={styles.item} key={image.key}>
							<IconButton
								className={styles.deleteButton}
								icon={<IconClose />}
								onClick={e => {
									e.stopPropagation();
									handleDelete(i);
								}}
							/>
							<img src={image.blob} alt={`${i}번째 업로드 미리보기`} />
						</SwiperSlide>
					))}
				</Swiper>
			) : (
				<div className={styles.imageWrap}>
					{canAdd && <ImageUploadInput disabled={!canAdd} onAddFile={handleAddFiles} />}
					{visibleImages.map((image, i) => (
						<div
							className={styles.item}
							key={image.key}
							draggable={dragdrop}
							onDragStart={e => {
								setDragIdx(i);
								e.dataTransfer.setData('text/plain', 'exist-images');
							}}
							onDragOver={handleDragOver(dragIdx, i)}
							onDragEnd={() => {
								setDragIdx(null);
								setTimeout(() => updateFileInput(), 0);
							}}
							style={dragOverOpacity(i)}>
							<IconButton
								className={styles.deleteButton}
								icon={<IconClose />}
								onClick={e => {
									e.stopPropagation();
									handleDelete(i);
								}}
							/>
							<img src={image.blob} alt={`${i}번째 업로드 미리보기`} />
						</div>
					))}
				</div>
			)}

			<input
				type="hidden"
				name={`${name}`}
				value={JSON.stringify(
					value.map(img => ({
						key: img.key,
						state: img.state
					}))
				)}
				ref={ref}
				form={form}
			/>
			<input
				type="file"
				name={`${name}_files`}
				style={{ display: 'none' }}
				multiple
				ref={setFileInputRef}
				form={form}
			/>
		</div>
	);
});

export default ImagePicker;
