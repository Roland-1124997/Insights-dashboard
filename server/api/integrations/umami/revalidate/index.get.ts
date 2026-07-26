export default defineSupabaseEventHandler(async (event) => {
	const { result } = await runTask("analytics");

	if (result === "Success")
		return useReturnResponse(event, {
			status: {
				success: true,
				code: 200,
				message: "cache successfully cleared",
			},
		});

	return useReturnResponse(event, {
		status: {
			success: false,
			code: 500,
			message: "cache could not be cleared",
		},
	});
});
