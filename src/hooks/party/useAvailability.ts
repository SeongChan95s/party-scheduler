import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	saveAvailability,
	getAvailabilitiesByParty,
	deleteAvailabilityByUserAndParty,
	calculateOverlappingSlots
} from '@/services/party';
import type { SaveAvailabilityInput, OverlapResult } from '@/types/party';

// Query Keys
const availabilityKeys = {
	all: ['availabilities'] as const,
	byParty: (partyId: string) => [...availabilityKeys.all, 'party', partyId] as const
};

/**
 * 파티 가용 시간 조회 + 겹치는 시간대 계산 (읽기)
 */
export const usePartyAvailabilities = (partyId: string) => {
	const { data: availabilities, isLoading } = useQuery({
		queryKey: availabilityKeys.byParty(partyId),
		queryFn: () => getAvailabilitiesByParty(partyId),
		enabled: !!partyId
	});

	// 겹치는 시간대 계산
	const overlappingSlots: OverlapResult[] =
		availabilities && availabilities.length >= 2
			? calculateOverlappingSlots(availabilities, 2)
			: [];

	return {
		availabilities,
		isLoading,
		overlappingSlots
	};
};

/**
 * 가용 시간 저장/삭제 (쓰기)
 */
export const useAvailabilityMutations = (partyId: string) => {
	const queryClient = useQueryClient();

	const saveMutation = useMutation({
		mutationFn: (input: SaveAvailabilityInput) => saveAvailability(input),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: availabilityKeys.byParty(partyId)
			});
		}
	});

	const deleteMutation = useMutation({
		mutationFn: (userId: string) => deleteAvailabilityByUserAndParty(userId, partyId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: availabilityKeys.byParty(partyId)
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
