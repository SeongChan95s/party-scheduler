import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createParty,
	getParty,
	getPartiesByUser,
	addParticipant,
	removeParticipant,
	updatePartyStatus,
	confirmPartySlot,
	updateParty,
	deleteParty
} from '@/services/party';
import type { CreatePartyInput, PartyStatus, TimeSlot } from '@/types/party';

// Query Keys
export const partyKeys = {
	all: ['parties'] as const,
	byUser: (userId: string) => [...partyKeys.all, 'user', userId] as const,
	detail: (partyId: string) => [...partyKeys.all, partyId] as const
};

// 파티 상세 조회
export const useParty = (partyId: string) => {
	return useQuery({
		queryKey: partyKeys.detail(partyId),
		queryFn: () => getParty(partyId),
		enabled: !!partyId
	});
};

// 사용자의 파티 목록 조회
export const usePartiesByUser = (userId: string) => {
	return useQuery({
		queryKey: partyKeys.byUser(userId),
		queryFn: () => getPartiesByUser(userId),
		enabled: !!userId
	});
};

// 파티 생성
export const useCreateParty = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreatePartyInput) => createParty(input),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: partyKeys.byUser(variables.creatorId)
			});
		}
	});
};

// 파티 참가
export const useAddParticipant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			partyId,
			userId
		}: {
			partyId: string;
			userId: string;
		}) => addParticipant(partyId, userId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: partyKeys.detail(variables.partyId)
			});
			queryClient.invalidateQueries({
				queryKey: partyKeys.byUser(variables.userId)
			});
		}
	});
};

// 파티 나가기
export const useRemoveParticipant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			partyId,
			userId
		}: {
			partyId: string;
			userId: string;
		}) => removeParticipant(partyId, userId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: partyKeys.detail(variables.partyId)
			});
			queryClient.invalidateQueries({
				queryKey: partyKeys.byUser(variables.userId)
			});
		}
	});
};

// 파티 상태 변경
export const useUpdatePartyStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			partyId,
			status
		}: {
			partyId: string;
			status: PartyStatus;
		}) => updatePartyStatus(partyId, status),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: partyKeys.detail(variables.partyId)
			});
		}
	});
};

// 파티 확정
export const useConfirmPartySlot = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ partyId, slot }: { partyId: string; slot: TimeSlot }) =>
			confirmPartySlot(partyId, slot),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: partyKeys.detail(variables.partyId)
			});
		}
	});
};

// 파티 정보 수정
export const useUpdateParty = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			partyId,
			data
		}: {
			partyId: string;
			data: Partial<{ title: string; description: string }>;
		}) => updateParty(partyId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: partyKeys.detail(variables.partyId)
			});
		}
	});
};

// 파티 삭제
export const useDeleteParty = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (partyId: string) => deleteParty(partyId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: partyKeys.all
			});
		}
	});
};
