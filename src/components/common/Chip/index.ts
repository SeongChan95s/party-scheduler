import { default as ChipMain } from './Chip';
import ChipSkeleton from './Chip.skeleton';

export const Chip = Object.assign(ChipMain, {
	Skeleton: ChipSkeleton
});
