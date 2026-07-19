interface Toast {
	id?: number;
	message: string;
	type: "success" | "error" | "info" | "warning";
	duration?: number;
	save?: Function | null;
	discard?: Function | null;
	broadcast?: boolean;
}

const toasts = ref<Toast[]>([]);
const channel = new BroadcastChannel("toast-channel");

export const useToast = () => {
	channel.onmessage = (event) => {
		const toast = event.data;

		addToast({
			...toast,
			broadcast: false, // voorkom een loop
		});
	};

	const addToast = ({ message, type = "success", duration = 3000, discard: toastDiscard, save: toastSave, broadcast = true }: Toast): void => {
		const id = Date.now();

		const discard = !toastDiscard
			? null
			: () => {
					toastDiscard();
					setTimeout(() => removeToast(id), 800);
				};

		const save = !toastSave
			? null
			: () => {
					toastSave();
					setTimeout(() => removeToast(id), 800);
				};

		toasts.value.push({ id, message, type, discard, save });
		if (toasts.value.length > 6) toasts.value.shift();

		if (broadcast) {
			channel.postMessage({
				message,
				type,
				duration,
			});
		}

		setTimeout(() => removeToast(id), duration);
	};

	const removeToast = (id: number): void => {
		toasts.value = toasts.value.filter((toast) => toast.id !== id);
	};

	return {
		toasts,
		addToast,
		removeToast,
	};
};
