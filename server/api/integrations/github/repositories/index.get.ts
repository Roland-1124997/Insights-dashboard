export default defineSupabaseEventHandler(async (event, { user, server }) => {
	const { data: connection, error } = await usefetchGithubConnections(server, user);
	const per_page = 50;

	if (error || !connection)
		return useReturnResponse(event, {
			status: {
				success: false,
				message: "Geen verbinding met GitHub gevonden",
				redirect: "https://github.com/apps/insights-dashboard/installations/new",
				code: 404,
			},
		});

	const currentPage = Number(getQuery(event).page ?? 1);

	const { data: repo, error: repo_error } = await useGetRepositories(connection.token, per_page);

	if (repo)
		return useReturnResponse(event, {
			status: {
				success: true,
				code: 200,
				message: "projecten succesvol opgehaald",
			},
			pagination: {
				page: currentPage,
				total: Math.ceil(repo.total_count / per_page),
			},
			data: repo.repositories,
		});

	if (repo_error) {
		const { data: refresh_connection } = await useRefreshGithubConnections(server, user, connection.installation_id);

		if (refresh_connection) {
			const { data: repo, error: repo_error } = await useGetRepositories(refresh_connection.token, per_page);
			if (repo_error) return useReturnResponse(event, notFoundError);

			if (repo)
				return useReturnResponse(event, {
					status: {
						success: true,
						code: 200,
						message: "projecten succesvol opgehaald",
					},
					pagination: {
						page: currentPage,
						total: Math.ceil(repo.total_count / per_page),
					},
					data: repo.repositories,
				});
		}
	}
});
