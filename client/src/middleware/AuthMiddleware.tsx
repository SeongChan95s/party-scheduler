import { IconAlertFilled } from '@/components/common/Icon';
import { useGlobalToastStore } from '@/components/global/Popup/GlobalToast';
import { getAsyncUser } from '@/utils/auth/getAsyncUser';
import { redirect } from 'react-router-dom';

export const AuthMiddleware = async () => {
	const user = await getAsyncUser();
	const callbackURL = localStorage.getItem('callbackURL');
	if (user) {
		useGlobalToastStore.getState().push({
			icon: <IconAlertFilled />,
			message: '이미 로그인중입니다.'
		});
		throw redirect(callbackURL ?? '/');
	}
};
