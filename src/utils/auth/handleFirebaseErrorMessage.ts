import type { FirebaseError } from 'firebase/app';

/**
 * Firebase Auth 에러 핸들링
 */
export const handleFirebaseAuthErrorMessage = (error: FirebaseError): string => {
	switch (error.code) {
		case 'auth/user-not-found':
			return '등록되지 않은 이메일입니다.';
		case 'auth/wrong-password':
			return '비밀번호가 일치하지 않습니다.';
		case 'auth/invalid-email':
			return '올바르지 않은 이메일 형식입니다.';
		case 'auth/invalid-credential':
			return '이메일 또는 비밀번호가 올바르지 않습니다.';
		case 'auth/popup-closed-by-user':
			return '로그인 창이 닫혔습니다.';
		case 'auth/cancelled-popup-request':
			return '로그인 요청이 취소되었습니다.';
		case 'auth/network-request-failed':
			return '네트워크 연결을 확인해주세요.';
		case 'auth/too-many-requests':
			return '로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.';
		case 'auth/user-disabled':
			return '비활성화된 계정입니다.';
		case 'auth/account-exists-with-different-credential':
			return '이미 다른 로그인 방법으로 등록된 이메일입니다.';

		default:
			return `로그인 중 오류가 발생했습니다. (${error.code})`;
	}
};
