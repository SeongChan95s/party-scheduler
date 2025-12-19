import z from 'zod';
import { regDisplayName, regNumber, regPassword } from '../constants/regex';
import { Timestamp } from 'firebase/firestore';

const email = z.email('이메일 형식이 아닙니다');
const password = z.string().regex(regPassword, '영문 숫자 조합 8자리 이상');
const displayName = z
	.string()
	.min(2, '2자 이상')
	.max(20, '20자 이하')
	.regex(regDisplayName, '한글, 영문, 숫자, 언더스코어만 사용 가능합니다.');

export const loginInputSchema = z.object({
	email,
	password
});

export const registerJoinInputSchema = z
	.object({
		email,
		password,
		passwordConfirm: password,
		displayName
	})
	.refine(data => data.password == data.passwordConfirm, {
		path: ['passwordConfirm'],
		message: '비밀번호가 일치하지 않습니다.'
	});

export const requiredUserDBschema = z.object({
	uid: z.string(),
	displayName: z.string().min(2, '닉네임은 최소 2글자 이상이어야 합니다.'),
	tag: z.string().regex(regNumber, '숫자필수').length(4),
	photoURL: z.string().nullish(),
	role: z.enum(['member', 'admin']).default('member'),
	provider: z.enum(['kakao', 'naver', 'google', 'x', 'email']),
	notification: z
		.object({
			all: z.boolean().default(false),
			invited: z.boolean().default(false),
			party: z.boolean().default(false),
			board: z.boolean().default(false),
			comment: z.boolean().default(false),
			service: z.boolean().default(false)
		})
		.default({
			all: false,
			invited: false,
			party: false,
			board: false,
			comment: false,
			service: false
		}),
	updatedAt: z.custom<Timestamp>().default(() => Timestamp.fromDate(new Date())),
	createdAt: z.custom<Timestamp>().default(() => Timestamp.fromDate(new Date())),
	lastLoginAt: z
		.custom<Timestamp>()
		.default(() => Timestamp.fromDate(new Date()))
		.transform(() => Timestamp.fromDate(new Date()))
});
