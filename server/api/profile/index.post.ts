export default defineBaseEventHandler(async (event) => {
	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "OK",
			success: true,
		},
	});
});
