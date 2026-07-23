export default defineSupabaseEventHandler(async (event, { server, user }) => {
	const { data, error } = await server.from("access-tokens").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Tokens retrieved successfully",
			success: true,
		},
		data: {
			values:
				data
					?.map((token) => {
						const expiresAt = token.expires_at ? new Date(token.expires_at) : "9999-12-31";
						const type = token.expires_at ? "date" : "infinity";

						return {
							id: token.id,
							label: token.name ? token.name.charAt(0).toUpperCase() + token.name.slice(1) : "",
							sleutel: {
								value: "************",
								type: "plain",
							},
							vervaldatum: {
								value: expiresAt,
								type: type,
							},
						};
					})
					.sort((a, b) => {
						return new Date(b.vervaldatum.value).getTime() - new Date(a.vervaldatum.value).getTime();
					}) || [],
		},
	});
});
