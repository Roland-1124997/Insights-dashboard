export default defineEventHandler((event) => {
	if (event.context.blocked) {
		setResponseStatus(event, 403);
		return {
			status: {
				code: 403,
				success: false,
				message: "Forbidden",
			},
		};
	}
});
