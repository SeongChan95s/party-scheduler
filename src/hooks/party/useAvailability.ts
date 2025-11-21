import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	saveAvailability,
	getAvailabilitiesByParty,
	deleteAvailabilityByUserAndParty,
	calculateOverlappingSlots
} from '@/services/party';
import { getUserDisplayNames } from '@/services/user/userService';
import type {
	SaveAvailabilityInput,
	OverlapResult,
	AvailabilityWithUserName
} from '@/types/party';

/**
 * 파티 가용 시간 조회 + 겹치는 시간대 계산 (읽기)
 * @returns `availabilities` 파티 참가자들의 가용 시간 목록
 * @returns `overlappingSlots` 2명 이상이 겹치는 시간대 목록
 */
export const usePartyAvailabilities = (partyId: string) => {
	const { data: availabilities, isLoading: isLoadingAvailabilities } = useQuery({
		queryKey: ['availabilities', 'party', partyId],
		queryFn: () => getAvailabilitiesByParty(partyId)
	});

	// userId 배열 추출
	const userIds = useMemo(
		() => availabilities?.map(a => a.userId) || [],
		[availabilities]
	);

	// Firebase Functions를 통해 displayName 조회
	const { data: userDisplayNames, isLoading: isLoadingUserNames } = useQuery({
		queryKey: ['userDisplayNames', userIds],
		queryFn: () => getUserDisplayNames(userIds),
		enabled: userIds.length > 0
	});

	// availabilities에 userName 추가
	const availabilitiesWithUserName = useMemo((): AvailabilityWithUserName[] => {
		if (!availabilities || !userDisplayNames) return [];

		return availabilities.map(availability => ({
			...availability,
			userName: userDisplayNames[availability.userId] || '익명'
		}));
	}, [availabilities, userDisplayNames]);

	// 겹치는 시간대 계산
	const overlappingSlots: OverlapResult[] = useMemo(
		() =>
			availabilitiesWithUserName && availabilitiesWithUserName.length >= 2
				? calculateOverlappingSlots(availabilitiesWithUserName, 2)
				: [],
		[availabilitiesWithUserName]
	);

	return {
		availabilities: availabilitiesWithUserName,
		isLoading: isLoadingAvailabilities || isLoadingUserNames,
		overlappingSlots
	};
};

/**
 * 가용 시간 저장/삭제 (쓰기)
 * @returns save - 가용 시간 저장 함수
 * @returns remove - 가용 시간 삭제 함수
 * @returns isSaving - 저장 진행 중 여부
 * @returns isDeleting - 삭제 진행 중 여부
 */
export const useAvailabilityMutations = (partyId: string) => {
	const queryClient = useQueryClient();

	const saveMutation = useMutation({
		mutationFn: (input: SaveAvailabilityInput) => saveAvailability(input),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['availabilities', 'party', partyId]
			});
		}
	});

	const deleteMutation = useMutation({
		mutationFn: (userId: string) => deleteAvailabilityByUserAndParty(userId, partyId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['availabilities', 'party', partyId]
			});
		}
	});

	return {
		save: saveMutation.mutate,
		remove: deleteMutation.mutate,
		isSaving: saveMutation.isPending,
		isDeleting: deleteMutation.isPending
	};
};
