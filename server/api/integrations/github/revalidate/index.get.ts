export default defineSupabaseEventHandler(async (event, { server, user }) => {
	const { data: connection, error } = await usefetchGithubConnections(server, user);
	if (error || !connection) return useReturnResponse(event, notFoundError);

	const cache = useStorage("cache:nitro:functions:repos:");
	await cache.removeItem(`${connection.token}.json`);

	const per_page = 50;
	const { error: repo_error } = await useGetRepositories(connection.token, per_page);

	if (repo_error) {
		const { data: refresh_connection } = await useRefreshGithubConnections(server, user, connection.installation_id);

		if (refresh_connection) {
			const { error: repo_error } = await useGetRepositories(refresh_connection.token, per_page);
			if (repo_error) return useReturnResponse(event, notFoundError);
		}
	}

	return useReturnResponse(event, {
		status: {
			success: true,
			code: 200,
			message: "cache successfully cleared",
		},
	});
});
