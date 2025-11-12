import { create } from 'zustand';
import { Toast } from '../../common/Toast';

interface ToastItem {
	id: string;
	icon?: React.ReactNode;
	button?: React.ReactNode;
	message: string;
	visible: boolean;
}

interface UseGlobalToastStore {
	queue: ToastItem[];
	push: (value: Pick<ToastItem, 'icon' | 'message' | 'button'>) => void;
	setVisible: (id: string, visible: boolean) => void;
	remove: (id: string) => void;
}

export const useGlobalToastStore = create<UseGlobalToastStore>()(set => ({
	queue: [],
	push: value => {
		const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
		const newItem: ToastItem = {
			id,
			icon: value.icon,
			message: value.message,
			button: value.button,
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

export default function GlobalToast() {
	const queue = useGlobalToastStore(state => state.queue);
	const setVisible = useGlobalToastStore(state => state.setVisible);
	const remove = useGlobalToastStore(state => state.remove);

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
				<Toast
					key={item.id}
					visible={item.visible}
					button={item.button}
					onChange={() => handleClose(item.id)}>
					{item?.icon}
					{item.message}
				</Toast>
			))}
		</>
	);
}
