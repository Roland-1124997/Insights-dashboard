export default defineAuthEventHandler(async (event, { client }) => {
	const { data, error } = await client.auth.passkey.startAuthentication();

	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Passkey login options retrieved successfully",
			success: true,
		},
		data,
	});
});
