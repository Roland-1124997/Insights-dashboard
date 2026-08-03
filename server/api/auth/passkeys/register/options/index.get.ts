export default defineSupabaseEventHandler(async (event, { client }) => {
	const { data, error } = await client.auth.passkey.startRegistration();

	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Passkey registration options retrieved successfully",
			success: true,
		},
		data,
	});
});
