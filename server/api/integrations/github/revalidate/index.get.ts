export default defineSupabaseEventHandler(async (event, { server, user }) => {
	const { data: connection, error } = await usefetchGithubConnections(server, user);
	if (error || !connection) return useReturnResponse(event, notFoundError);

	const cache = useStorage("cache:nitro:functions:repos:");
	await cache.removeItem(`${connection.token.split(".")[1]}.json`);

	return useReturnResponse(event, {
		status: {
			success: true,
			code: 200,
			message: "cache successfully cleared",
		},
	});
});
