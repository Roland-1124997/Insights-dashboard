export default defineEventHandler(async (event) => {
	const client = await serverSupabaseClient(event);
	const currentSession = await useGetCookies(event);

	const method = useGetLoginMethod(currentSession?.access_token);

	const { data, error: sessionError } = await useGetSession(event, client, currentSession);

	if (sessionError) {
		const canRefresh = Boolean(currentSession?.refresh_token) && [401, 403].includes(Number(sessionError.status));

		if (!canRefresh) return useReturnResponse(event, unauthorizedError);

		const { data: refreshedData, error: refreshError } = await useRefreshSession(client, currentSession);
		if (!refreshedData.session || refreshError) return useReturnResponse(event, unauthorizedError);

		const method = useGetLoginMethod(currentSession?.access_token);

		useSetCookies(event, refreshedData.session);

		return useReturnResponse(event, {
			status: {
				success: true,
				message: "Ok",
				code: 200,
			},
			data: await useSetSessionData(event, { ...refreshedData.user, isPassKey: method == "passkey" } as SupaBaseUser),
		});
	}

	return useReturnResponse(event, {
		status: {
			success: true,
			message: "gebruiker gevonden",
			code: 200,
		},
		data: await useSetSessionData(event, { ...data.user, isPassKey: method == "passkey" } as SupaBaseUser),
	});
});
