export const getFileFormat = (fileName: string) => {
	const dotIndex = fileName.lastIndexOf('.');
	return fileName.substring(dotIndex + 1);
};
