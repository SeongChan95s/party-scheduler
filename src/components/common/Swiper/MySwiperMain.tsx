import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';
import { Children } from 'react';

import { Autoplay, EffectCoverflow, FreeMode, Grid, Pagination } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';
import 'swiper/swiper-bundle.css';
import './MySwiper.scss';

interface MySwiperMain {
	variant?: 'auto' | 'free' | 'card' | 'cardPerView' | 'coverflow' | 'grid';
	pagination?: string;
	navigation?: string;
	className?: string;
	slidesPerView?: number | 'auto';
	spaceBetween?: string | number;
	onSlideChange?: (swiper: SwiperClass) => void;
	slidesOffsetAfter?: boolean;
	children: React.ReactNode;
	inner?: boolean;
	rest?: SwiperOptions;
}

export default function MySwiperMain({
	variant = 'auto',
	navigation,
	pagination,
	className = '',
	slidesPerView = 'auto',
	inner = false,
	slidesOffsetAfter = false,
	spaceBetween = 4,
	onSlideChange,
	children,
	...rest
}: MySwiperMain) {
	// params
	const swiperParams: { [key: string]: SwiperOptions } = {
		auto: {
			slidesPerView,
			spaceBetween
		},

		free: {
			slidesPerView,
			spaceBetween,
			freeMode: {
				enabled: true,
				momentumRatio: 0.8
			},
			modules: [FreeMode]
		},

		card: {
			slidesPerView,
			spaceBetween,
			freeMode: {
				enabled: true,
				momentumRatio: 0.8
			},
			pagination: {
				enabled: true,
				clickable: true,
				dynamicBullets: true,
				dynamicMainBullets: 2
			},
			modules: [FreeMode, Pagination]
		},

		cardPerView: {
			slidesPerView,
			spaceBetween,
			pagination: {
				enabled: true,
				clickable: true,
				dynamicBullets: true
			},
			modules: [Pagination]
		},

		coverflow: {
			effect: 'coverflow',
			centeredSlides: true,
			slidesPerView: 'auto',
			initialSlide: 1,
			coverflowEffect: {
				rotate: 0,
				stretch: -5,
				depth: 160,
				modifier: 1,
				slideShadows: true
			},
			autoplay: {
				delay: 3000
			},
			modules: [EffectCoverflow, Autoplay]
		},

		grid: {
			slidesPerView,
			spaceBetween,
			freeMode: {
				enabled: true,
				momentumRatio: 0.8
			},
			grid: {
				rows: 2,
				fill: 'row'
			},
			pagination: {
				enabled: true,
				clickable: true,
				dynamicBullets: true
			},
			modules: [Grid, FreeMode, Pagination]
		}
	};

	// variant = params
	let variantProps: SwiperOptions;

	switch (variant) {
		case 'coverflow':
			variantProps = swiperParams.coverflow;
			break;
		case 'grid':
			variantProps = swiperParams.grid;
			break;
		case 'card':
			variantProps = swiperParams.card;
			break;
		case 'cardPerView':
			variantProps = swiperParams.cardPerView;
			break;
		default:
			variantProps = swiperParams.auto;
	}

	// children을 각 child로 나눠서 SwiperSlide로 wrapping 한다.
	const childrenArray = Children.toArray(children);
	const innerClass = inner ? 'inner' : '';
	const spaceBetWeenCss = {
		'--space-between': `${spaceBetween}px`
	} as React.CSSProperties;
	const slidesOffsetAfterClass = slidesOffsetAfter ? 'slidesOffsetAfter' : '';
	const slideAutoWidth = slidesPerView == 'auto' ? 'swiper-auto' : '';

	// 슬라이드 변경 시 bullet 가운데로
	const handleSlideChange = (swiper: SwiperClass) => {
		onSlideChange?.(swiper);
	};

	return (
		<Swiper
			{...variantProps}
			{...rest}
			onSlideChange={handleSlideChange}
			className={`my-swiper swiper-variant-${variant} swiper-navigation-${navigation} swiper-pagination-${pagination} ${innerClass} ${slideAutoWidth} ${slidesOffsetAfterClass} ${className}`}
			style={spaceBetWeenCss}>
			{childrenArray.map((child, i) => {
				return <SwiperSlide key={i}>{child}</SwiperSlide>;
			})}
		</Swiper>
	);
}
