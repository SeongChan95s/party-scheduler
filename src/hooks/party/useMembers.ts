import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	addMember,
	getMembersByParty,
	getMember,
	updateMemberStatus,
	removeMember
} from '@/services/party';

// Query keys
export const membersKeys = {
	all: ['members'] as const,
	byParty: (partyId: string) => [...membersKeys.all, 'party', partyId] as const,
	detail: (partyId: string, userId: string) =>
		[...membersKeys.all, 'party', partyId, userId] as const
};

// Party의 Members 목록 조회
export const useMembersByParty = (partyId: string) => {
	return useQuery({
		queryKey: membersKeys.byParty(partyId),
		queryFn: () => getMembersByParty(partyId),
		enabled: !!partyId
	});
};

// 특정 Member 조회
export const useMember = (partyId: string, userId: string) => {
	return useQuery({
		queryKey: membersKeys.detail(partyId, userId),
		queryFn: () => getMember(partyId, userId),
		enabled: !!partyId && !!userId
	});
};

// Member 추가
export const useAddMember = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			partyId,
			userId,
			status,
			inviterId
		}: {
			partyId: string;
			userId: string;
			status: 'invite' | 'waiting-approval';
			inviterId?: string;
		}) => addMember(partyId, userId, status, inviterId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: membersKeys.byParty(variables.partyId)
			});
		}
	});
};

// Member 상태 변경
export const useUpdateMemberStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			partyId,
			userId,
			status
		}: {
			partyId: string;
			userId: string;
			status: 'invite' | 'waiting-approval';
		}) => updateMemberStatus(partyId, userId, status),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: membersKeys.detail(variables.partyId, variables.userId)
			});
		}
	});
};

// Member 제거
export const useRemoveMember = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ partyId, userId }: { partyId: string; userId: string }) =>
			removeMember(partyId, userId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: membersKeys.byParty(variables.partyId)
			});
		}
	});
};
