export default defineSupabaseEventHandler(async (event, { user, server }) => {
	const request = await readBody(event);

	const { error: zodError } = await schema.installation.backend.safeParseAsync(request);

	if (zodError)
		return useReturnResponse(event, {
			status: {
				success: false,
				message: "Er is een fout opgetreden bij het valideren van de aanvraag",
				code: 400,
			},
			error: {
				type: "fields",
				details: zodError.issues,
			},
		});

	const { data: connection } = await usefetchGithubConnections(server, user);

	if (connection)
		return useReturnResponse(event, {
			status: {
				success: false,
				message: "Er is al een verbinding met GitHub gemaakt",
				code: 400,
			},
		});

	const { data, error } = await useOctokit(request.installation_id);

	if (error || !data) return useReturnResponse(event, internalServerError);

	await useSaveInstall(server, "Create", user, data);

	return useReturnResponse(event, {
		status: {
			success: true,
			message: "De verbinding met GitHub is succesvol gemaakt",
			code: 200,
		},
	});
});
