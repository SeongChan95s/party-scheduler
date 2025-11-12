import { useEffect, type RefObject } from 'react';

/**
 * targetRef 요소 바깥의 영역을 클릭하면 callback을 실행
 */
export default function useClickOutside<T extends HTMLElement>(
	targetRef: RefObject<T | null>,
	callback: () => void
) {
	useEffect(() => {
		const outsideClickHandle = (e: MouseEvent) => {
			if (targetRef.current && !targetRef.current.contains(e.target as Node)) {
				callback();
			}
		};

		const timeoutId = setTimeout(() => {
			document.addEventListener('click', outsideClickHandle);
		}, 0);

		return () => {
			clearTimeout(timeoutId);
			document.removeEventListener('click', outsideClickHandle);
		};
	}, [targetRef, callback]);
}
