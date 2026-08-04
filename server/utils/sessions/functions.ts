import { H3Event } from "h3";
import { SupabaseClient, Session, User, AuthError } from "@supabase/supabase-js";

export type { SupabaseClient, Session, User };
export type SupaBaseUser = User & { current_session_id: string; aal: string; isPassKey: boolean };
type SessionLookupResult = {
	data: { user: SupaBaseUser | null };
	error: any;
};

type NavigatorRequest = {
	ip: string;
	country_code?: string;
	region_code?: string;
	city?: string;
	continent_code?: string;
	timezone?: string;
	screen?: string;
};

const kownIps = new Map<string, NavigatorRequest>();
const pendingSessionLookups = new Map<string, Promise<SessionLookupResult>>();

export const validateAccessToken = (currentSession: Session | Omit<Session, "user">) => {
	if (!currentSession?.access_token) {
		return {
			valid: false,
			error: {
				message: "de gebruiker heeft geen valide acces token",
				status: 401,
			},
		};
	}
	return { valid: true, error: null };
};

export const validateRefreshToken = (currentSession: Session | Omit<Session, "user">) => {
	if (!currentSession?.refresh_token) {
		return {
			valid: false,
			error: {
				message: "De gebruiker heeft geen valide refresh token",
				status: 401,
			},
		};
	}
	return { valid: true, error: null };
};

export const useRefreshSession = async (client: SupabaseClient<Database>, currentSession: Session | Omit<Session, "user">) => {
	try {
		const validation = validateRefreshToken(currentSession);
		if (!validation.valid)
			return {
				data: { user: null, session: null },
				error: validation.error,
			};

		return await client.auth.refreshSession(currentSession);
	} catch (error: any) {
		return {
			data: { user: null, session: null },
			error: new AuthError(error.message, error.status),
		};
	}
};

export const useGetSession = async (event: H3Event, client: SupabaseClient<Database>, currentSession: Session | Omit<Session, "user"> | null) => {
	if (!currentSession?.access_token)
		return {
			data: { user: null },
			error: { message: "De gebruiker heeft geen active sessie", status: 401 },
		};

	const session_id = extractSessionId(currentSession) as string;
	if (!session_id)
		return {
			data: { user: null },
			error: { message: "De gebruiker heeft geen active sessie", status: 401 },
		};

	const cachedResult = await useGetCachedUser(session_id);
	if (cachedResult) return cachedResult;

	const pendingLookup = pendingSessionLookups.get(session_id);
	if (pendingLookup) return pendingLookup;

	const lookupPromise = (async (): Promise<SessionLookupResult> => {
		const { data: supabaseUser, error } = await useFetchSupabaseUser(event, client, currentSession.access_token!, session_id);
		const user = supabaseUser ? { ...supabaseUser } : null;

		if (user && !error) await useSetCachedUser(session_id, user);

		return {
			data: {
				user,
			},
			error,
		};
	})();

	pendingSessionLookups.set(session_id, lookupPromise);

	try {
		return await lookupPromise;
	} finally {
		pendingSessionLookups.delete(session_id);
	}
};

export const useDeleteSession = async (client: SupabaseClient<Database>, user: SupaBaseUser) => {
	const { error } = await client.rpc("delete_sessions_by_id", {
		p_session_id: user.current_session_id,
	});
	if (!error) await useDeleteCachedUser(user.current_session_id!);
	return { error };
};

export const useSessionExists = async (event: H3Event, client: SupabaseClient<Database>) => {
	const currentSession = await serverSupabaseSession(event);
	const { data, error } = await useGetSession(event, client, currentSession);

	return { data: data?.user, error };
};

export const extractSessionId = (session: Omit<Session, "user">): string | undefined => {
	if (session?.access_token) {
		try {
			const sessionTokenParts = session.access_token.split(".");
			if (sessionTokenParts.length >= 2 && sessionTokenParts[1]) {
				const token = JSON.parse(Buffer.from(sessionTokenParts[1], "base64").toString("ascii"));
				return token.session_id;
			}
		} catch {
			return;
		}
	}
	return;
};

export const useGetLoginMethod = (access_token?: string): string | null => {
	if (access_token) {
		const token = access_token?.split(".")[1];

		if (!token) return null;

		const payload = JSON.parse(Buffer.from(token, "base64").toString("utf8"));

		return payload.amr[0].method;
	}

	return null;
};

export const useSetSessionData = async (event: H3Event, user: SupaBaseUser | null) => {
	if (user) {
		const isPasskey = user?.isPassKey || false;

		const hasMFA = !!(user.factors && user.factors[0] && user.factors[0].status === "verified");
		const needsVerification = hasMFA && user?.aal !== "aal2" && !isPasskey;

		if (needsVerification) return { mfa_needs_to_verified: true };

		return {
			id: user.id,
			session: user.current_session_id,
			email: user.email,
			factors: {
				verified: isPasskey ? false : hasMFA,
				enabled: !!(user.factors && user.factors[0] && user.factors[0].status === "verified"),
				passkey: isPasskey,
			},
		};
	}

	return;
};

export const useSetCachedUser = async (session_id: string, user: SupaBaseUser, ttl: number = 60 * 5) => {
	const cachedStorage = useStorage<SupaBaseUser>("sessions");
	await cachedStorage.setItem(session_id, user, { ttl });
};

export const useDeleteCachedUser = async (session_id: string) => {
	const cachedStorage = useStorage<SupaBaseUser>("sessions");
	await cachedStorage.removeItem(session_id);
};

const useGetCachedUser = async (session_id: string) => {
	const cachedStorage = useStorage<SupaBaseUser>("sessions");
	const cachedUser = await cachedStorage.getItem(session_id);

	if (cachedUser)
		return {
			data: {
				user: {
					...cachedUser,
				},
			},
			error: null,
		};

	return null;
};

const useFetchSupabaseUser = async (event: H3Event, client: SupabaseClient<Database>, access_token: string, session_id: string) => {
	const { data, error } = await client.auth.getUser(access_token);
	const user = await serverSupabaseUser(event);

	const supabaseUser = {
		...data.user,
		current_session_id: session_id,
		aal: user?.aal,
	} as SupaBaseUser;

	return { data: supabaseUser, error };
};

export const useFetchUserByAccessToken = async (client: SupabaseClient<Database>, token: string) => {
	const { data: access, error } = await client.from("access-tokens").select("user_id").eq("token", token).single();

	if (!error && access.user_id) {
		const { data } = await client.auth.admin.getUserById(access.user_id);

		return { data: data.user, error: null };
	}

	return { data: null, error };
};

export const useCreateNavigatorSession = async (event: H3Event, server: SupabaseClient<Database>, user: SupaBaseUser, request: NavigatorRequest) => {
	let data: NavigatorRequest | null = null;
	let error: any = null;

	if (!kownIps.has(request.ip)) {
		await fetch(`https://geoip.vuiz.net/geoip?ip=${request.ip}`)
			.then((res) => res.json())
			.then((data: NavigatorRequest) => kownIps.set(request.ip, data))
			.catch((err) => {
				error = err;
			});
	}

	if (error) return { data, error };

	data = kownIps.get(request.ip)!;

	const { error: failure } = await server.from("navigator_sessions").insert({
		id: user.current_session_id,
		ip: request.ip,
		screen: request.screen,
		country_code: data.country_code,
		region_code: data.region_code,
		continent_code: data.continent_code,
		city: data.city,
		timezone: data.timezone,
	});

	if (failure) return { data, error: failure };

	return { data, error: null };
};
