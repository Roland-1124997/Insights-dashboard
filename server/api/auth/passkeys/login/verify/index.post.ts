export default defineAuthEventHandler(async (event, { client }) => {
	const request = await readBody(event);

	const challenge_id = request.challenge_id;
	const credential = request.credential;

	const { data, error } = await client.auth.passkey.verifyAuthentication({
		challengeId: challenge_id,
		credential: credential,
	});

	if (error) return useReturnResponse(event, internalServerError);

	useSetCookies(event, data.session);

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Passkey login verified successfully",
			redirect: "/",
			success: true,
		},
	});
});
