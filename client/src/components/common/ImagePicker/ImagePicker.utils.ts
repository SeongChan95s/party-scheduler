import type { ImagePickerMetadata } from './ImagePicker';
import { getFileFormat } from '../../../utils/getFileFormat';

/**
 * urls 를 받아서 state 초기화
 */
export const convertImagePickerItems = (
	urls?: string[]
): ImagePickerMetadata[] | undefined => {
	return urls?.map(key => ({
		key,
		file: null,
		blob: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${key}`,
		state: 'initial'
	}));
};

export interface ImagePickerServerData {
	key: string;
	state: 'initial' | 'upload' | 'delete';
}

export type ImagePickerParsedData =
	| { key: string; state: 'initial' | 'delete'; file: null }
	| { key: string; state: 'upload'; file: File };

export const parseImagePickerFormData = (
	formData: FormData,
	name: string
): ImagePickerParsedData[] => {
	const dataStr = formData.get(`${name}_metadata`) as string;
	const files = formData.getAll(`${name}`) as (string | File)[];
	const fileList = files.filter((item): item is File => item instanceof File);

	if (!dataStr) return [];

	try {
		const imageData: ImagePickerServerData[] = JSON.parse(dataStr);

		// upload 상태인 이미지와 파일 매칭
		let fileIndex = 0;
		const result: ImagePickerParsedData[] = imageData.map(data => {
			if (data.state === 'upload') {
				const file = fileList[fileIndex++];
				if (!file) {
					throw new Error(`upload 상태의 이미지에 대응하는 파일이 없습니다: ${data.key}`);
				}
				return {
					key: data.key,
					state: 'upload',
					file
				};
			}
			return {
				key: data.key,
				state: data.state as 'initial' | 'delete',
				file: null
			};
		});

		return result;
	} catch {
		return [];
	}
};

/**
 * FileList를 ImagePickerItem[]으로 변환 (유효성 검사 및 중복 제거 포함)
 */
export const processFiles = (
	files: FileList,
	existingImages: ImagePickerMetadata[],
	acceptExts: string[],
	maxSizeMB: number
): ImagePickerMetadata[] => {
	const arr = Array.from(files);

	// 유효성 검사
	const validFiles = arr.filter(file => {
		const ext = getFileFormat(file.name).toLowerCase();
		const sizeMB = file.size / 1024 / 1024;
		return acceptExts.includes(ext) && sizeMB <= maxSizeMB;
	});

	// 중복 체크
	const nonDuplicateFiles = validFiles.filter(file => {
		const fileIdentifier = `${file.name}_${file.size}`;
		return !existingImages.some(img => {
			if (img.state === 'delete') return false;
			if (img.file) {
				const existingIdentifier = `${img.file.name}_${img.file.size}`;
				return existingIdentifier === fileIdentifier;
			}
			return false;
		});
	});

	// ImagePickerItem[]으로 변환
	return nonDuplicateFiles.map(file => ({
		key: file.name,
		file,
		blob: window.URL.createObjectURL(file),
		state: 'upload'
	}));
};
