export const useWindow = () => {
	const open = (url: string, options: string) => {
		window.open(url, "_blank", options);
	};

	const close = () => {
		window.close();
	};

	return {
		open,
		close,
	};
};
