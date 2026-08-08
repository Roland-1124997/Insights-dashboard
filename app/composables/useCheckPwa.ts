export const useCheckPwa = () => {
	const installed = ref(false);
	const { $pwa } = useNuxtApp();

	const cookie = useCookie("pwa-installed", {
		maxAge: 60 * 60 * 24 * 9999,
	});

	if (cookie.value) installed.value = !!cookie.value;
	else
		onMounted(() => {
			if ($pwa && $pwa.isPWAInstalled) {
				installed.value = true;
				cookie.value = "true";
			}
		});

	return { installed };
};
