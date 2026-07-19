export const useGithub = defineStore("useGithub", () => {
	const { addToast } = useToast();
	const { close } = useWindow();

	const uri: FetchUrl = "/api/integrations/github";
	const request = useApiHandler<ApiResponse<null>>(uri);

	const error = ref<ErrorResponse | null>(null);
	const loading = ref<boolean>(true);

	const init = async () => {
		loading.value = true;
		error.value = null;

		await new Promise((resolve) => setTimeout(resolve, 3000));

		const { query } = useRoute();
		const { data, error: Error } = await request.Post({ body: query });

		if (!Error && data?.data) {
			loading.value = false;
		} else {
			loading.value = false;
			error.value = Error;
		}
	};

	const complete = async (succes = true) => {
		if (succes)
			addToast({
				type: "success",
				message: "Github verbinding is succesvol gemaakt. Je kunt nu je repositories importeren.",
			});
		else
			addToast({
				type: "error",
				message: "Er is iets mis gegaan bij het verbinden van Github.",
			});

		close();
	};
	const refresh = async () => await init();

	return {
		error,
		loading,
		init,
		refresh,
		complete,
	};
});
