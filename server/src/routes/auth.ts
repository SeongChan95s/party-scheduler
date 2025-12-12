import { Router, Request, Response } from 'express';
import admin from 'firebase-admin';

const router = Router();

interface NaverTokenRequest {
	code: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

interface NaverUserInfo {
	id: string;
	email?: string;
	nickname?: string;
	profile_image?: string;
}

router.post('/naver', async (req: Request, res: Response) => {

	try {
		const { code, clientId, clientSecret, redirectUri } =
			req.body as NaverTokenRequest;

		if (!code || !clientId || !clientSecret || !redirectUri) {
			res.status(400).json({ error: '필수 파라미터가 누락되었습니다.' });
			return;
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
			console.error('네이버 토큰 교환 실패:', errorText);
			res.status(tokenResponse.status).json({
				error: `네이버 토큰 교환 실패: ${tokenResponse.status}`
			});
			return;
		}

		const tokenData = await tokenResponse.json();

		// 2. 사용자 정보 조회
		const userInfoResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`
			}
		});

		if (!userInfoResponse.ok) {
			const errorText = await userInfoResponse.text();
			console.error('네이버 사용자 정보 조회 실패:', errorText);
			res.status(userInfoResponse.status).json({
				error: `네이버 사용자 정보 조회 실패: ${userInfoResponse.status}`
			});
			return;
		}

		const userInfoData = await userInfoResponse.json();
		const userInfo = userInfoData.response as NaverUserInfo;

		// 3. Firebase Custom Token 생성
		const uid = `${userInfo.id}`;

		try {
			// 사용자 존재 여부 확인 및 업데이트/생성
			try {
				if (userInfo.nickname) {
					await admin.auth().updateUser(uid, {
						displayName: userInfo.nickname,
						photoURL: userInfo.profile_image
					});
				}
			} catch (updateError) {
				if ((updateError as any).code === 'auth/user-not-found') {
					await admin.auth().createUser({
						uid,
						displayName: userInfo.nickname,
						photoURL: userInfo.profile_image,
						email: userInfo.email
					});
				} else {
					throw updateError;
				}
			}

			// Custom Token 생성 (claims는 커스텀 클레임용)
			const customToken = await admin.auth().createCustomToken(uid, {
				provider: 'naver'
			});

			res.json({
				customToken,
				user: userInfo
			});
		} catch (error) {
			console.error('Custom Token 생성 실패:', error);
			res.status(500).json({ error: 'Custom Token 생성에 실패했습니다.' });
		}
	} catch (error) {
		console.error('네이버 토큰 교환 중 오류 발생:', error);
		res.status(500).json({ error: '서버 오류가 발생했습니다.' });
	}
});


interface KakaoTokenRequest {
	code: string;
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}


interface KakaoUserInfo {
	id: number;
	kakao_account: {
		profile: {
			nickname: string;
			profile_image_url: string;
		};
	};
}

router.post('/kakao', async (req: Request, res: Response) => {
	try {
		const { code, clientId, clientSecret, redirectUri } = req.body as KakaoTokenRequest;

		if (!code || !clientId || !clientSecret || !redirectUri) {
			res.status(400).json({ error: '필수 파라미터가 누락되었습니다.' });
			return;
		}

		const params = new URLSearchParams({
			grant_type: 'authorization_code',
			client_id: clientId,
			client_secret: clientSecret,
			code,
			redirect_uri: redirectUri
		});

		const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			},
			body: params.toString()
		});

		if (!tokenResponse.ok) {
			const errorText = await tokenResponse.text();
			res.status(tokenResponse.status).json({
				error: `카카오 토큰 교환 실패: ${tokenResponse.status} ${errorText}`
			});
			return;
		}

		const tokenData = await tokenResponse.json();

		res.json({ success: true, data: tokenData });
	} catch (error) {
		res.status(500).json({ error: '서버 오류가 발생했습니다.' });
	}
});

export default router;
