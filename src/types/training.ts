import type { Timestamp } from 'firebase/firestore';

export type Training = {
	id: string;
	title: string;
	description: string;
	date: Timestamp;
	participants: string[];
	createdAt: Timestamp;
	updatedAt: Timestamp;
};

// Firestore에 저장할 때는 id를 제외
export type TrainingInput = Omit<Training, 'id'>;
