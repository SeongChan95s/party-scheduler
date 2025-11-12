import type { ImagePickerItem } from './ImagePicker';

export const convertImagePickerItems = (
	value?: string[]
): ImagePickerItem[] | undefined => {
	return value?.map(key => ({
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
	const dataStr = formData.get(name) as string;
	const files = formData.getAll(`${name}_files`) as (string | File)[];
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
