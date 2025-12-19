import { IconClose } from '../Icon';
import { IconButton } from '../IconButton';
import { useRef, useState, useEffect, forwardRef } from 'react';
import { IconIncrease } from '../Icon';
import { classNames } from '../../../utils/classNames';
import { Swiper, SwiperSlide } from 'swiper/react';
import { processFiles } from './ImagePicker.utils';
import styles from './ImagePicker.module.scss';

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

export interface MetadataBase {
	key: string;
	file: File | null;
	blob: string;
	state: 'initial' | 'upload' | 'delete';
}

export type ImagePickerMetadata =
	| (MetadataBase & { state: 'initial' | 'delete'; file: null })
	| (MetadataBase & { state: 'upload'; file: File });

interface ImagePickerProps {
	className?: string;
	name?: string;
	value?: ImagePickerMetadata[];
	defaultValue?: ImagePickerMetadata[];
	maxCount?: number;
	maxSizeMB?: number;
	acceptExts?: string[];
	swiper?: boolean;
	dragdrop?: boolean;
	form?: string;
	onInitial?: (value: ImagePickerMetadata[]) => void;
	onChange?: (files: File[]) => void;
	onMetadataChange?: (value: ImagePickerMetadata[]) => void;
}

/**
 * 이미지 업로드 관리 컴포넌트
 * @param maxCount 최대 업로드 수
 * @param maxSizeMB 이미지당 최대 용량
 */
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
		onMetadataChange,
		onChange
	},
	ref
) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [uncontrolledValue, setUncontrolledValue] =
		useState<ImagePickerMetadata[]>(defaultValue);
	const isControlled = controlledValue != undefined;
	const value = isControlled ? controlledValue : uncontrolledValue;

	const setValue = (value: ImagePickerMetadata[]) => {
		if (!isControlled) setUncontrolledValue(value);
		onMetadataChange?.(value);

		const uploadFiles = value
			.filter(img => img.state === 'upload' && img.file)
			.map(img => img.file!)
			.filter(Boolean);
		onChange?.(uploadFiles);
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

			const result: ImagePickerMetadata[] = [];
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

	const updateFileInput = (currentImages?: ImagePickerMetadata[]) => {
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
		const currentCount = value.filter(img => img.state !== 'delete').length;
		if (maxCount && currentCount + files.length > maxCount) return;

		const addedImages = processFiles(files, value, acceptExts, maxSizeMB);

		const newImages = [...value, ...addedImages];
		setValue?.(newImages);
		setTimeout(() => updateFileInput(newImages), 0);
	};

	const handleDelete = (idx: number) => {
		const img = value[idx];
		let newImages: ImagePickerMetadata[];

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
				name={`${name}_metadata`}
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
				name={`${name}`}
				style={{ display: 'none' }}
				multiple
				ref={setFileInputRef}
				form={form}
			/>
		</div>
	);
});

export default ImagePicker;
