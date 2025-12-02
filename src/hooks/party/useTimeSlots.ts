import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	saveTimeSlots,
	getTimeSlotsByPlan,
	deleteTimeSlots,
	calculateOverlappingSlots
} from '@/services/party';
import { getUserDisplayNames } from '@/services/user/userService';
import type {
	SaveTimeSlotsInput,
	OverlapResult,
	TimeSlotsWithUserName
} from '@/types/party';

// Query keys
export const timeSlotsKeys = {
	all: ['timeSlots'] as const,
	byPlan: (partyId: string, planId: string) =>
		[...timeSlotsKeys.all, 'party', partyId, 'plan', planId] as const
};

/**
 * TimeSlots collection 조회 + userName 추가 + 겹치는 시간대 계산
 */
export const useTimeSlotsByPlan = (partyId: string, planId: string) => {
	const { data: timeSlots, isLoading: isLoadingTimeSlots } = useQuery({
		queryKey: timeSlotsKeys.byPlan(partyId, planId),
		queryFn: () => getTimeSlotsByPlan(partyId, planId)
	});

	// userId 배열 추출
	const userIds = useMemo(() => timeSlots?.map(ts => ts.id) || [], [timeSlots]);

	// Firebase Functions를 통해 displayName 조회
	const { data: userDisplayNames, isLoading: isLoadingUserNames } = useQuery({
		queryKey: ['userDisplayNames', userIds],
		queryFn: () => getUserDisplayNames(userIds),
		enabled: userIds.length > 0
	});

	// timeSlots에 userName 추가
	const timeSlotsWithUserName = useMemo((): TimeSlotsWithUserName[] => {
		if (!timeSlots || !userDisplayNames) return [];

		return timeSlots.map(ts => ({
			...ts,
			userName: userDisplayNames[ts.id] || '익명'
		}));
	}, [timeSlots, userDisplayNames]);

	// 겹치는 시간대 계산
	const overlappingSlots: OverlapResult[] = useMemo(
		() =>
			timeSlotsWithUserName.length >= 2
				? calculateOverlappingSlots(timeSlotsWithUserName, 2)
				: [],
		[timeSlotsWithUserName]
	);

	return {
		timeSlots: timeSlotsWithUserName,
		isLoading: isLoadingTimeSlots || isLoadingUserNames,
		overlappingSlots
	};
};

/**
 * TimeSlots 저장/삭제
 */
export const useTimeSlotsMutations = (partyId: string, planId: string) => {
	const queryClient = useQueryClient();

	const saveMutation = useMutation({
		mutationFn: (input: SaveTimeSlotsInput) => saveTimeSlots(input),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: timeSlotsKeys.byPlan(partyId, planId)
			});
		}
	});

	const deleteMutation = useMutation({
		mutationFn: (userId: string) => deleteTimeSlots(partyId, planId, userId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: timeSlotsKeys.byPlan(partyId, planId)
			});
		}
	});

	return {
		save: (
			input: SaveTimeSlotsInput,
			options?: {
				onSuccess?: () => void;
				onError?: (error: unknown) => void;
			}
		) => {
			saveMutation.mutate(input, options);
		},
		remove: (userId: string) => {
			deleteMutation.mutate(userId);
		},
		isSaving: saveMutation.isPending,
		isDeleting: deleteMutation.isPending
	};
};
