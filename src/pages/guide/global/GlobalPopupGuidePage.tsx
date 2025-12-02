import { Button } from '../../../components/common/Button';
import { IconAlertFilled } from '../../../components/common/Icon';
import { TextButton } from '../../../components/common/TextButton';
import { useGlobalDialog } from '../../../components/global/Popup/GlobalDialog';
import { useGlobalToastStore } from '../../../components/global/Popup/GlobalToast';

export default function GlobalPopupGuidePage() {
	return (
		<div className="guide-popup-page">
			<main>
				<header className="main-header inner">
					<h2>글로벌 팝업 가이드</h2>
				</header>

				<div className="main-content inner">
					<div className="article-content flex gap-12">
						<Button
							size="sm"
							onClick={() =>
								useGlobalToastStore.getState().push({
									icon: <IconAlertFilled />,
									message: '글로벌 토스트 입니다.',
									button: <TextButton className="text-label-2">Action</TextButton>
								})
							}>
							Toast
						</Button>

						<Button
							size="sm"
							onClick={() =>
								useGlobalDialog.getState().push({
									title: '제목 입니다.',
									body: '본문 입니다.',
									action: {
										name: '확인',
										fn: () => console.log('확인')
									},
									overlay: true
								})
							}>
							Dialog
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}
