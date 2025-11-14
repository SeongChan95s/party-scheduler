import z from 'zod';
import { regDate, regDisplayName, regPassword, regPhone } from '../constants/regex';

export const loginInputSchema = z.object({
	email: z.email('이메일 형식이 아닙니다'),
	password: z.string().regex(regPassword, '영문 숫자 조합 8자리 이상')
});

export const registerJoinInputSchema = z.object({
	email: z.email('이메일 형식이 아닙니다'),
	password: z.string().regex(regPassword, '영문 숫자 조합 8자리 이상'),
	phone: z.string().regex(regPhone, '휴대폰 번호 형식이 아닙니다.'),
	displayName: z
		.string()
		.min(2, '2자 이상')
		.max(20, '20자 이하')
		.regex(regDisplayName, '한글, 영문, 숫자, 언더스코어만 사용 가능합니다.'),
	birth: z.string().regex(regDate, '날짜를 선택해주세요.')
});
