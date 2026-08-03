export default defineSupabaseEventHandler(async (event, { client }) => {
	const request = await readBody(event);

	const challenge_id = request.challenge_id;
	const credential = request.credential;

	const { error } = await client.auth.passkey.verifyRegistration({
		challengeId: challenge_id,
		credential: credential,
	});

	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Passkey registration verified successfully",
			success: true,
		},
	});
});
