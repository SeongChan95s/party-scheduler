import { useRef } from 'react';

interface UseHoverDelayOptions {
	onEnter?: () => void;
	onLeave?: () => void;
	delay?: number;
	enabled?: boolean;
}

/**
 * 마우스를 hover 및 leave하면 delay(ms) 뒤에 callback 실행
 */
export default function useHoverDelay({
	onEnter,
	onLeave,
	delay = 0,
	enabled = true
}: UseHoverDelayOptions) {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = () => {
		if (!enabled) return;

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		onEnter?.();
	};

	const handleMouseLeave = () => {
		if (!enabled) return;

		if (delay > 0) {
			timeoutRef.current = setTimeout(() => {
				onLeave?.();
				timeoutRef.current = null;
			}, delay);
		} else {
			onLeave?.();
		}
	};

	return {
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave
	};
}
