import { useState } from 'react';
import { Button } from '../../../components/common/Button';
import { BottomSheet } from '../../../components/common/BottomSheet';
import { IconButton } from '../../../components/common/IconButton';
import { IconClose } from '../../../components/common/Icon';
import type { BottomSheetState } from '../../../components/common/BottomSheet/BottomSheet';
import { SideSheet } from '../../../components/common/SideSheet';
import '@/assets/styles/pages/guide.scss';

export default function SheetGuidePage() {
	const [bottomSheetState, setBottomSheetState] = useState<BottomSheetState>('closed');
	const [sideSheetState, setSideSheetState] = useState<boolean>(false);
	const [sideSheetDirection, setSideSheetDirection] = useState<'left' | 'right'>('left');

	return (
		<div className="sheet-guide-page">
			<main>
				<header className="main-header inner">
					<h2>팝업 가이드</h2>
				</header>

				<div className="main-content">
					<article>
						<div className="inner">
							<h3>Bottom Sheet</h3>
							<div className="button-wrap flex flex-wrap gap-x-12 gap-y-9">
								<Button size="sm" onClick={() => setBottomSheetState('collapsed')}>
									Bottom Sheet (collapsed)
								</Button>
								<Button size="sm" onClick={() => setBottomSheetState('expanded')}>
									Bottom Sheet (expanded)
								</Button>
							</div>
						</div>
					</article>
					<article>
						<div className="inner">
							<h3>Side Sheet</h3>
							<div className="button-wrap flex flex-wrap gap-x-12 gap-y-9">
								<Button
									size="sm"
									onClick={() => {
										setSideSheetState(true);
										setSideSheetDirection('left');
									}}>
									Side Sheet (left)
								</Button>
								<Button
									size="sm"
									onClick={() => {
										setSideSheetState(true);
										setSideSheetDirection('right');
									}}>
									Side Sheet (right)
								</Button>
							</div>
						</div>
					</article>
				</div>

				<SideSheet
					open={sideSheetState}
					direction={sideSheetDirection}
					onChange={() => setSideSheetState(false)}>
					<SideSheet.CloseButton className="" />
					사이드 시트
				</SideSheet>

				<BottomSheet
					state={bottomSheetState}
					variant="collapsed"
					onChange={value => setBottomSheetState(value)}>
					<div className="flex">
						<IconButton
							className="ml-auto"
							icon={<IconClose />}
							onClick={() => setBottomSheetState('closed')}
						/>
					</div>
				</BottomSheet>
			</main>
		</div>
	);
}
