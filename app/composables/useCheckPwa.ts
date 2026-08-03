export const useCheckPwa = () => {
	const installed = ref(false);
	const { $pwa } = useNuxtApp();

	const cookie = useCookie("pwa-installed");

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
