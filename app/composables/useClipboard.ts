export const useClipboard = async () => {
	const data = ref();
	const error = ref(false);
	const message = ref();

	const paste = async (): Promise<string | undefined> => {
		try {
			const text = await navigator.clipboard.readText();

			if (text) {
				data.value = text;
				error.value = false;
				return text;
			} else {
				error.value = true;
				message.value = "Klembord is leeg. Kopieer eerst de gewenste link.";
			}
		} catch {
			error.value = true;
			message.value = "Automatisch plakken wordt niet ondersteund op jouw apparaat. Klik op het veld en kies 'Plakken'.";
		}

		return undefined;
	};

	return {
		error: error,
		message: message,
		data: data,
		paste,
	};
};
