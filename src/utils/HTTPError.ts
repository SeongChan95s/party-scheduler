import { useGlobalToastStore } from '../components/global/Popup/GlobalToast';

export class HTTPError extends Error {
	status: number | undefined;
	timestamp: string;
	url: string | undefined;

	constructor(message: string, status?: number, url?: string) {
		super(message); // 반드시 호출해야함
		this.name = `HTTPError`;
		this.status = status;
		this.timestamp = new Date().toISOString();
		this.url = url;
	}

	log() {
		console.error(this);
	}

	showToast() {
		const pushAlert = useGlobalToastStore.getState().push;
		pushAlert({
			message: this.message
		});
	}
}
