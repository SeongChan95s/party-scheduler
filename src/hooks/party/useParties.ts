import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createParties, getParties, updateParties, deleteParties } from '@/services/party';
import type { CreatePartiesInput, PartiesInput } from '@/types/party';

// Query keys
export const partiesKeys = {
	all: ['parties'] as const,
	detail: (partyId: string) => [...partiesKeys.all, partyId] as const
};

// Parties 조회
export const useParties = (partyId: string) => {
	return useQuery({
		queryKey: partiesKeys.detail(partyId),
		queryFn: () => getParties(partyId),
		enabled: !!partyId
	});
};

// Parties 생성
export const useCreateParties = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreatePartiesInput) => createParties(input),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: partiesKeys.all
			});
		}
	});
};

// Parties 수정
export const useUpdateParties = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ partyId, data }: { partyId: string; data: Partial<PartiesInput> }) =>
			updateParties(partyId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: partiesKeys.detail(variables.partyId)
			});
		}
	});
};

// Parties 삭제
export const useDeleteParties = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (partyId: string) => deleteParties(partyId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: partiesKeys.all
			});
		}
	});
};
