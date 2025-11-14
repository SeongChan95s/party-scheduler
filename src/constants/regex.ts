export const regEmail =
	/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i; // 이메일 유효성

export const regPassword = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/; // 영문숫자조합 8자리 이상
export const regSpace = /^\s*$/; // 공백문자열
export const regPhone = /^(01[016789]{1})-?[0-9]{3,4}-?[0-9]{4}$/; // 휴대폰번호
export const regDisplayName = /^[가-힣a-zA-Z0-9_]+$/; // 닉네임 한글, 영문, 숫자, 언더스코어만
export const regBirth = /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/; // 생년월일 6자리(950814)

export const regDate =
	/^(19[0-9][0-9]|20\d{2})-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/; // 날짜 00-00-00
