import { create } from 'zustand';
import { Dialog } from '../../common/Dialog';
import { Button } from '../../common/Button';

interface ToastItem {
	id: string;
	title?: string;
	body?: string;
	overlay?: boolean;
	action?: {
		name: string;
		fn: () => void;
	};
	visible: boolean;
}

interface UseGlobalDialog {
	queue: ToastItem[];
	push: (value: Pick<ToastItem, 'title' | 'body' | 'overlay' | 'action'>) => void;
	setVisible: (id: string, visible: boolean) => void;
	remove: (id: string) => void;
}

export const useGlobalDialog = create<UseGlobalDialog>()(set => ({
	queue: [],
	push: value => {
		const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

		const newItem: ToastItem = {
			id,
			title: value.title,
			body: value.body,
			overlay: value.overlay ?? false,
			action: value?.action,
			visible: false
		};

		set(store => ({ queue: [...store.queue, newItem] }));

		requestAnimationFrame(() => {
			set(store => ({
				queue: store.queue.map(item =>
					item.id === id ? { ...item, visible: true } : item
				)
			}));
		});
	},
	setVisible: (id, visible) => {
		set(store => ({
			queue: store.queue.map(item => (item.id === id ? { ...item, visible } : item))
		}));
	},
	remove: id => {
		set(store => ({ queue: store.queue.filter(item => item.id !== id) }));
	}
}));

export default function GlobalDialog() {
	const queue = useGlobalDialog(state => state.queue);
	const setVisible = useGlobalDialog(state => state.setVisible);
	const remove = useGlobalDialog(state => state.remove);

	const handleClose = (id: string) => {
		setVisible(id, false);

		const timer = setTimeout(() => {
			remove(id);
			clearTimeout(timer);
		}, 600);
	};

	return (
		<>
			{queue.map(item => (
				<Dialog
					key={item.id}
					visible={item.visible}
					onChange={() => handleClose(item.id)}
					overlay={item.overlay}>
					<div className="p-21 text-center">
						{item.title && <h5 className="text-headline-3 peer">{item.title}</h5>}
						{item.body && (
							<p className="text-body-2 peer-[h5]:mt-12 text-gray-700">{item.body}</p>
						)}

						<div className="button-wrap flex gap-12 mt-21">
							<Dialog.CloseButton>
								<Button variant="outlined" fill>
									닫기
								</Button>
							</Dialog.CloseButton>
							{item.action && (
								<Button color="primary" fill onClick={item?.action?.fn}>
									액션
								</Button>
							)}
						</div>
					</div>
				</Dialog>
			))}
		</>
	);
}
