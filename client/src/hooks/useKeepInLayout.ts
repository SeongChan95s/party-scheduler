import { useEffect, useState, useTransition, type RefObject } from 'react';
import useViewportDimensions from './useViewportDimensions';
import { useLayoutStore } from '../Wrapper';

interface useRenderOffset {
	targetRef: RefObject<HTMLElement | null>;
	isVisible: boolean;
	offset?: number;
}

// global-layout 바깥으로 나간 수치 값을 반환하는 훅
export default function useKeepInLayout({
	targetRef,
	isVisible,
	offset = 0
}: useRenderOffset) {
	const { width: viewportWidth, height: viewportHeight } = useViewportDimensions();
	const [isPending, startTransition] = useTransition();
	const [dimension, setDimension] = useState({ x: 0, y: 0 });
	const layoutWidth = useLayoutStore(state => state.layoutWidth);

	useEffect(() => {
		const outWidth = (viewportWidth - layoutWidth) / 2;
		const rect = targetRef?.current?.getBoundingClientRect();
		const rectLeft = rect?.left ?? 0;
		const rectRight = rect?.right ?? 0;
		const rectTop = rect?.top ?? 0;
		const rectBottom = rect?.bottom ?? 0;

		let x = 0;
		let y = 0;

		startTransition(() => {
			if (isVisible) {
				// y축 보정
				if (rectBottom > viewportHeight) {
					y = (rectBottom - viewportHeight) * -1;
				}
				if (rectTop < 0) {
					y = rectTop * -1;
				}

				// 좌측 보정
				if (rectLeft < outWidth) {
					x = outWidth - rectLeft + offset;
				}

				// 우측 보정
				if (rectRight > layoutWidth + outWidth) {
					x = (rectRight - (layoutWidth + outWidth)) * -1 - offset;
				}
			}
			setDimension({ x, y });
		});
	}, [isVisible]);

	return { isPending, ...dimension };
}
