import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	saveAvailability,
	getAvailabilitiesByParty,
	deleteAvailabilityByUserAndParty,
	calculateOverlappingSlots
} from '@/services/party';
import type { SaveAvailabilityInput, OverlapResult } from '@/types/party';

/**
 * 파티 가용 시간 조회 + 겹치는 시간대 계산 (읽기)
 * @returns `availabilities` 파티 참가자들의 가용 시간 목록
 * @returns `overlappingSlots` 2명 이상이 겹치는 시간대 목록
 */
export const usePartyAvailabilities = (partyId: string) => {
	const { data: availabilities, isLoading } = useQuery({
		queryKey: ['availabilities', 'party', partyId],
		queryFn: () => getAvailabilitiesByParty(partyId)
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
				queryKey: ['availabilities', partyId]
			});
		}
	});

	const deleteMutation = useMutation({
		mutationFn: (userId: string) => deleteAvailabilityByUserAndParty(userId, partyId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['availabilities', partyId]
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
