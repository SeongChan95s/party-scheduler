import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { registerSW } from 'virtual:pwa-register';
import '@/assets/styles/base/_reset.scss';
import '@/assets/styles/base/_typography.scss';
import '@/assets/styles/base/_layout.scss';
import '@/assets/styles/base/tailwind.css';
import Router from './router';

// Service Worker 등록
const updateSW = registerSW({
	onNeedRefresh() {
		// 새로운 버전이 있을 때 사용자에게 알림
		if (confirm('새로운 버전이 있습니다. 지금 업데이트하시겠습니까?')) {
			updateSW(true);
		}
	},
	onOfflineReady() {
		// 오프라인 사용 준비 완료
		console.log('앱이 오프라인에서 사용 가능합니다.');
	}
});

createRoot(document.getElementById('root')!).render(
	<HelmetProvider>
		<Router />
	</HelmetProvider>
);
