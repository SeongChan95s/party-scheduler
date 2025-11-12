import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './BottomSheet.module.scss';
import { CSSTransition } from 'react-transition-group';
import { classNames } from '../../../utils/classNames';

export type BottomSheetState = 'closed' | 'collapsed' | 'expanded';

type HeightValue = number | `${number}vh` | `${number}px`;

interface BottomSheetProps {
	className?: string;
	containerClassName?: string;
	state: BottomSheetState;
	onChange: (value: BottomSheetState) => void;
	variant?: 'standard' | 'collapsed';
	maxHeight?: HeightValue;
	collapsedHeight?: number;
	dragThreshold?: number;
	overlay?: boolean;
	children: React.ReactNode;
}

export default function BottomSheet({
	className: classNameProp,
	containerClassName: containerClassNameProp,
	state,
	onChange,
	overlay = false,
	variant = 'standard',
	maxHeight,
	collapsedHeight = 50,
	dragThreshold = 0.1,
	children
}: BottomSheetProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [dragStartY, setDragStartY] = useState(0);
	const [temporaryHeight, setTemporaryHeight] = useState<number>(0);
	const [contentHeight, setContentHeight] = useState<number>(0);
	const sheetRef = useRef<HTMLDivElement>(null);
	const bottomSheetBodyRef = useRef<HTMLDivElement>(null);
	const dragStartHeightRef = useRef(0);
	const [maxHeightPx, setMaxHeightPx] = useState(0);

	const parseHeight = useCallback((height: HeightValue): number => {
		if (typeof height === 'number') {
			return height;
		}
		if (height.endsWith('vh')) {
			return (parseInt(height) / 100) * window.innerHeight;
		}
		if (height.endsWith('px')) {
			return parseInt(height);
		}
		return parseInt(height);
	}, []);

	useEffect(() => {
		const targetValue = maxHeight
			? parseHeight(maxHeight)
			: contentHeight > 0
			? contentHeight + 28
			: window.innerHeight * 0.8;

		setMaxHeightPx(targetValue);
	}, [maxHeight, contentHeight, parseHeight]);

	// 내부 높이 측정
	useEffect(() => {
		if (bottomSheetBodyRef.current) {
			setContentHeight(bottomSheetBodyRef.current.scrollHeight);
		}
	}, [children]);

	// 목표 높이 계산
	const getTargetHeight = useCallback(() => {
		if (state === 'closed') return 0;
		if (variant === 'standard') return maxHeightPx;
		return state === 'expanded' ? maxHeightPx : collapsedHeight;
	}, [state, variant, maxHeightPx, collapsedHeight]);

	// 현재 표시되어야 할 높이
	const displayHeight = temporaryHeight > 0 ? temporaryHeight : getTargetHeight();

	const getPointerY = useCallback((e: React.MouseEvent | React.TouchEvent): number => {
		return e.type.includes('mouse')
			? (e as React.MouseEvent).pageY
			: (e as React.TouchEvent).touches[0].pageY;
	}, []);

	// 드래그 시작
	const handleDragStart = useCallback(
		(e: React.MouseEvent | React.TouchEvent) => {
			if (state === 'closed') return;
			e.preventDefault();
			const startY = getPointerY(e);
			setIsDragging(true);
			setDragStartY(startY);
			dragStartHeightRef.current = displayHeight;
		},
		[state, displayHeight, getPointerY]
	);

	// 드래그 중
	const handleDragMove = useCallback(
		(e: React.MouseEvent | React.TouchEvent) => {
			if (!isDragging) return;
			const currentY = getPointerY(e);
			const deltaY = dragStartY - currentY;
			const newHeight = Math.max(
				0,
				Math.min(dragStartHeightRef.current + deltaY, maxHeightPx)
			);
			setTemporaryHeight(newHeight);
		},
		[isDragging, dragStartY, maxHeightPx, getPointerY]
	);

	const updateSheetState = useCallback(
		(dragDistance: number, dragPercentage: number) => {
			if (variant === 'standard') {
				if (dragDistance < 0 && dragPercentage >= dragThreshold) {
					onChange('closed');
				}
				return;
			}

			if (state === 'collapsed') {
				if (dragDistance > 0 && dragPercentage >= dragThreshold) {
					onChange('expanded');
				} else if (dragDistance < 0 && dragPercentage >= dragThreshold) {
					onChange('closed');
				}
			} else if (state === 'expanded') {
				if (dragDistance < 0 && dragPercentage >= dragThreshold) {
					onChange('collapsed');
				}
			}
		},
		[variant, state, dragThreshold, onChange]
	);

	// 드래그 종료
	const handleDragEnd = useCallback(() => {
		if (!isDragging) return;
		setIsDragging(false);

		const currentHeightPx = temporaryHeight > 0 ? temporaryHeight : displayHeight;
		const dragDistance = currentHeightPx - dragStartHeightRef.current;
		const dragPercentage = Math.abs(dragDistance) / maxHeightPx;

		updateSheetState(dragDistance, dragPercentage);
		setTemporaryHeight(0);
	}, [isDragging, temporaryHeight, displayHeight, maxHeightPx, updateSheetState]);

	useEffect(() => {
		const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
			if (isDragging) {
				e.preventDefault();
				handleDragMove(e as unknown as React.MouseEvent | React.TouchEvent);
			}
		};

		const handleGlobalEnd = () => {
			if (isDragging) {
				handleDragEnd();
			}
		};

		if (isDragging) {
			document.addEventListener('mousemove', handleGlobalMove);
			document.addEventListener('mouseup', handleGlobalEnd);
			document.addEventListener('touchmove', handleGlobalMove, {
				passive: false
			});
			document.addEventListener('touchend', handleGlobalEnd);
		}

		return () => {
			document.removeEventListener('mousemove', handleGlobalMove);
			document.removeEventListener('mouseup', handleGlobalEnd);
			document.removeEventListener('touchmove', handleGlobalMove);
			document.removeEventListener('touchend', handleGlobalEnd);
		};
	}, [isDragging, handleDragMove, handleDragEnd]);

	const className = {
		bottomSheet: classNames(styles.bottomSheet, overlay && styles.overlay, classNameProp),
		container: classNames(
			styles.container,
			isDragging && 'dragging',
			state === 'closed' && temporaryHeight === 0 && 'closed',
			containerClassNameProp
		),
		header: classNames(styles.bottomSheetHeader, isDragging && 'dragging')
	};

	return (
		<CSSTransition
			nodeRef={sheetRef}
			in={state != 'closed'}
			timeout={{ enter: 0, exit: 250 }}
			mountOnEnter
			unmountOnExit>
			<aside ref={sheetRef} className={className.bottomSheet}>
				<div className={className.container} style={{ height: `${displayHeight}px` }}>
					<div
						className={`${className.header} bottom-sheet-header`}
						onMouseDown={handleDragStart}
						onTouchStart={handleDragStart}>
						<div className={styles.dragHandle} />
					</div>
					<div
						ref={bottomSheetBodyRef}
						className={`${styles.bottomSheetBody} bottom-sheet-body`}>
						{children}
					</div>
				</div>
			</aside>
		</CSSTransition>
	);
}
