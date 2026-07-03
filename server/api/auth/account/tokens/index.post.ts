export default defineMultiFactorVerificationEventHandler(async (event, { server, user }) => {
	const request = await readBody(event);
	const { error: zodError } = await schema.token.backend.safeParseAsync(request);

	if (zodError)
		return useReturnResponse(event, {
			...badRequestError,
			error: {
				type: "fields",
				details: zodError.issues,
			},
		});

	const token = useEncryptValue(crypto.randomUUID(), true);

	const { error } = await server.from("access-tokens").insert({
		expires_at: request.expires_at,
		name: request.name,
		token: token,
		user_id: user.id,
	});

	if (error)
		return useReturnResponse(event, {
			...badRequestError,
			error: {
				type: "fields",
				details: {
					name: "Er is iets misgegaan bij het aanmaken van de toegangssleutel. Probeer het later opnieuw.",
				},
			},
		});

	return useReturnResponse(event, {
		status: {
			success: true,
			message: "Toegangssleutel aangemaakt",
			code: 200,
		},
		data: {
			label: request.name,
			sleutel: useDecryptValue(token, true),
			vervaldatum: request.expires_at,
		},
	});
});
