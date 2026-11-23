import { H3Event } from "h3";
const { production } = useRuntimeConfig();

export const useGetCookies = async (event: H3Event) => {
	const refreshToken = getCookie(event, "refresh-token");
	let session: any = null;

	try {
		session = await serverSupabaseSession(event);
	} catch (error: any) {
		const message = String(error?.statusMessage || error?.message || "");

		if (message.includes("Refresh Token") || message.includes("refresh_token") || message.includes("Auth session missing")) {
			return null;
		}

		throw error;
	}

	const currentSession: Omit<Session, "user"> | null = {
		refresh_token: refreshToken as string,
		access_token: session?.access_token || ("" as string),
		expires_in: 3600,
		token_type: "bearer",
	};

	return currentSession;
};

export const useSetCookies = (event: H3Event, session: Omit<Session, "user"> | null) => {
	if (session) {
		setCookie(event, "refresh-token", session.refresh_token, {
			maxAge: 60 * 60 * 24 * 14,
			httpOnly: true,
			secure: production,
			sameSite: production ? "lax" : "strict",
			domain: production ? ".roland-meijer.nl" : undefined,
		});
	}
};

export const useDeleteCookies = async (event: H3Event) => {
	deleteCookie(event, "refresh-token");
	deleteCookie(event, "access-token");
};
