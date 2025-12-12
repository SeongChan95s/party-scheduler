import { Timestamp } from 'firebase/firestore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createPlan,
	getPlan,
	getPlansByParty,
	updatePlan,
	deletePlan,
	addPlanParticipant,
	removePlanParticipant,
	confirmPlanSchedule
} from '@/services/party';
import type { CreatePlansInput, PlansInput } from '@/types/party';

// Query keys
export const plansKeys = {
	all: ['plans'] as const,
	byParty: (partyId: string) => [...plansKeys.all, 'party', partyId] as const,
	detail: (partyId: string, planId: string) =>
		[...plansKeys.all, 'party', partyId, planId] as const
};

// Plan 조회
export const usePlan = (partyId: string, planId: string) => {
	return useQuery({
		queryKey: plansKeys.detail(partyId, planId),
		queryFn: () => getPlan(partyId, planId),
		enabled: !!partyId && !!planId
	});
};

// Party의 Plans 목록 조회
export const usePlansByParty = (partyId: string) => {
	return useQuery({
		queryKey: plansKeys.byParty(partyId),
		queryFn: () => getPlansByParty(partyId),
		enabled: !!partyId
	});
};

// Plan 생성
export const useCreatePlan = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ partyId, input }: { partyId: string; input: CreatePlansInput }) =>
			createPlan(partyId, input),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: plansKeys.byParty(variables.partyId)
			});
		}
	});
};

// Plan 수정
export const useUpdatePlan = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			partyId,
			planId,
			data
		}: {
			partyId: string;
			planId: string;
			data: Partial<PlansInput>;
		}) => updatePlan(partyId, planId, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: plansKeys.detail(variables.partyId, variables.planId)
			});
		}
	});
};

// Plan 삭제
export const useDeletePlan = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ partyId, planId }: { partyId: string; planId: string }) =>
			deletePlan(partyId, planId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: plansKeys.byParty(variables.partyId)
			});
		}
	});
};

// Plan 참가자 추가
export const useAddPlanParticipant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ partyId, planId, userId }: { partyId: string; planId: string; userId: string }) =>
			addPlanParticipant(partyId, planId, userId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: plansKeys.detail(variables.partyId, variables.planId)
			});
		}
	});
};

// Plan 참가자 제거
export const useRemovePlanParticipant = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ partyId, planId, userId }: { partyId: string; planId: string; userId: string }) =>
			removePlanParticipant(partyId, planId, userId),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: plansKeys.detail(variables.partyId, variables.planId)
			});
		}
	});
};

// Plan 일정 확정
export const useConfirmPlanSchedule = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			partyId,
			planId,
			schedule
		}: {
			partyId: string;
			planId: string;
			schedule: { start: Timestamp; end: Timestamp };
		}) => confirmPlanSchedule(partyId, planId, schedule),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: plansKeys.detail(variables.partyId, variables.planId)
			});
		}
	});
};
