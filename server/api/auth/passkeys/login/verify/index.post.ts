export default defineAuthEventHandler(async (event, { client, server }) => {
	const request = await readBody(event);

	const challenge_id = request.challenge_id;
	const credential = request.credential;

	const { data, error } = await client.auth.passkey.verifyAuthentication({
		challengeId: challenge_id,
		credential: credential,
	});

	if (error) return useReturnResponse(event, internalServerError);
	if (!data.session || !data.user) return useReturnResponse(event, internalServerError);

	useSetCookies(event, data.session);

	const session_id = extractSessionId(data.session) as string;
	await useCreateNavigatorSession(event, server, { ...data.user, current_session_id: session_id } as SupaBaseUser, request);

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Passkey login verified successfully",
			redirect: "/",
			success: true,
		},
	});
});
