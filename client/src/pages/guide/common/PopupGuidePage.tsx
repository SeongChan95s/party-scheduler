import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { Dialog } from '../../../components/common/Dialog';
import { Toast } from '../../../components/common/Toast';
import '@/assets/styles/pages/guide.scss';

export default function PopupGuidePage() {
	const [dialogState, setDialogState] = useState(false);
	const [toastState, setToastState] = useState(false);

	return (
		<div className="popup-guide-page">
			<main>
				<header className="main-header inner">
					<h2>팝업 가이드</h2>
				</header>

				<div className="main-content inner">
					<div className="article-content flex gap-12">
						<Button size="sm" onClick={() => setToastState(true)}>
							Toast
						</Button>
						<Button size="sm" onClick={() => setDialogState(true)}>
							Dialog
						</Button>
					</div>
				</div>

				<Dialog visible={dialogState} onChange={state => setDialogState(state)} overlay>
					다이알로그
					<Dialog.CloseButton>
						<Button>닫기</Button>
					</Dialog.CloseButton>
				</Dialog>

				<Toast visible={toastState} onChange={value => setToastState(value)}>
					토스트 팝업입니다.
				</Toast>
			</main>
		</div>
	);
}
