import { setGlobalOptions } from 'firebase-functions';
import { onCall } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';

// Firebase Admin 초기화
admin.initializeApp();

setGlobalOptions({ maxInstances: 10 });

interface NaverTokenRequest {
	code: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

interface NaverTokenResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
	id_token?: string;
}

interface NaverUserInfo {
	id: string;
	email?: string;
	name?: string;
	profile_image?: string;
}

/**
 * 네이버 OAuth 토큰 교환 및 사용자 정보 조회
 */
export const exchangeNaverToken = onCall(async request => {
	try {
		const { code, clientId, clientSecret, redirectUri } =
			request.data as NaverTokenRequest;

		if (!code || !clientId || !clientSecret || !redirectUri) {
			throw new Error('필수 파라미터가 누락되었습니다.');
		}

		// 1. 토큰 교환
		const params = new URLSearchParams({
			grant_type: 'authorization_code',
			client_id: clientId,
			client_secret: clientSecret,
			code,
			redirect_uri: redirectUri
		});

		const tokenResponse = await fetch('https://nid.naver.com/oauth2.0/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: params.toString()
		});

		if (!tokenResponse.ok) {
			const errorText = await tokenResponse.text();
			logger.error('네이버 토큰 교환 실패:', errorText);
			throw new Error(`네이버 토큰 교환 실패: ${tokenResponse.status}`);
		}

		const tokenData: NaverTokenResponse = await tokenResponse.json();

		// 2. 사용자 정보 조회
		const userInfoResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`
			}
		});

		if (!userInfoResponse.ok) {
			const errorText = await userInfoResponse.text();
			logger.error('네이버 사용자 정보 조회 실패:', errorText);
			throw new Error(`네이버 사용자 정보 조회 실패: ${userInfoResponse.status}`);
		}

		const userInfoData = await userInfoResponse.json();
		const userInfo = userInfoData.response as NaverUserInfo;

		// 3. Firebase Custom Token 생성
		const uid = `${userInfo.id}`;

		try {
			const customToken = await admin.auth().createCustomToken(uid, {
				provider: 'naver',
				email: userInfo.email,
				name: userInfo.name,
				picture: userInfo.profile_image
			});

			return {
				customToken,
				user: userInfo
			};
		} catch (error) {
			logger.error('Custom Token 생성 실패:', error);
			throw new Error('Custom Token 생성에 실패했습니다.');
		}
	} catch (error) {
		logger.error('네이버 토큰 교환 중 오류 발생:', error);
		throw error;
	}
});

/**
 * 카카오 OAuth 토큰 교환 함수
 */
export const exchangeKakaoToken = onCall(async request => {
	try {
		const { code, clientId, clientSecret, redirectUri } =
			request.data as NaverTokenRequest;

		if (!code || !clientId || !clientSecret || !redirectUri) {
			throw new Error('필수 파라미터가 누락되었습니다.');
		}

		const params = new URLSearchParams({
			grant_type: 'authorization_code',
			client_id: clientId,
			client_secret: clientSecret,
			code,
			redirect_uri: redirectUri
		});

		const response = await fetch('https://kauth.kakao.com/oauth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			},
			body: params.toString()
		});

		if (!response.ok) {
			const errorText = await response.text();
			logger.error('카카오 토큰 교환 실패:', errorText);
			throw new Error(`카카오 토큰 교환 실패: ${response.status}`);
		}

		const data: NaverTokenResponse = await response.json();
		return data;
	} catch (error) {
		logger.error('카카오 토큰 교환 중 오류 발생:', error);
		throw error;
	}
});
