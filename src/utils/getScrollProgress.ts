/**
 * scrollPosition까지 스크롤 진행도를 1~0까지 소수점 두 자릿수로 반환
 */
export const getScrollProgress = (scrollPosition?: number) => {
	if (scrollPosition) {
		const scrollProgress =
			Math.trunc(Math.min(1, (scrollY / scrollPosition) * 1) * 100) / 100;

		return scrollProgress;
	}

	return 0;
};
