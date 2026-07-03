export default defineTask({
	meta: {
		name: "token-invalidation",
		description:
			"This task is responsible for invalidating tokens by making a request to the specified URL with the provided method. It is useful for ensuring that tokens are properly invalidated and can help maintain security and access control within the application.",
	},
	async run() {
		const server = useSupaBaseServer();

		const date = new Date().toISOString().split("T")[0] || "";

		const { error } = await server.from("access-tokens").delete().eq("expires_at", date);
		if (error) return { result: "Error" };

		return { result: "Success" };
	},
});
