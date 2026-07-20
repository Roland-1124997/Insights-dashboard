export const useWindow = () => {
	const isIOS = ref(false);

	onMounted(() => {
		isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
	});

	const cookie = useCookie("github_redirect_url");

	const open = (url: string, options: string) => {
		const target = isIOS.value ? "_self" : "_blank";
		if (isIOS.value) cookie.value = useRoute().fullPath;

		window.open(url, target, options);
	};

	const close = async () => {
		if (isIOS.value) {
			const redirectUrl = cookie.value || "/artikelen/opstellen";
			await navigateTo(redirectUrl);
			cookie.value = null;
		} else {
			window.close();

			setTimeout(async () => {
				if (!window.closed) await navigateTo("/");
			}, 100);
		}
	};

	return {
		open,
		close,
	};
};
