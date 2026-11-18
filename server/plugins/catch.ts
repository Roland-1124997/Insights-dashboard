import { H3Event } from "h3";
import { FetchError } from "ofetch";

const { logging } = useRuntimeConfig();

const failuresByIP = new Map<string, number[]>();
const bannedIPs = new Map<string, number>();

const isAuthAPI = (pathname: string) => pathname === "/api/auth" || pathname.startsWith("/api/auth/");

const isBlocked = (ip: string) => {
	const bannedUntil = bannedIPs.get(ip);

	if (!bannedUntil) return false;
	if (bannedUntil > Date.now()) return true;

	bannedIPs.delete(ip);
	return false;
};

const trackFailure = (event: H3Event, statusCode: number) => {
	const ip = event.context.requestIp as string | undefined;
	if (!ip) return;

	const { pathname } = getRequestURL(event);
	const shouldTrack = statusCode === 404 || ([400, 401, 403].includes(statusCode) && isAuthAPI(pathname));
	if (!shouldTrack) return;

	const now = Date.now();
	const windowStart = now - logging.fail2ban.window;
	const failures = (failuresByIP.get(ip) || []).filter((timestamp) => timestamp > windowStart);

	failures.push(now);
	failuresByIP.set(ip, failures);

	if (failures.length >= logging.limit) {
		bannedIPs.set(ip, now + logging.fail2ban.duration);
		failuresByIP.delete(ip);
		event.context.blocked = true;
	}
};

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook("request", (event) => {
		event.context.starttime = performance.now();
		event.context.requestId = crypto.randomUUID();

		const ip = getRequestIP(event, { xForwardedFor: true });
		if (!ip) return;

		event.context.requestIp = ip;
		event.context.blocked = isBlocked(ip);
	});

	nitroApp.hooks.hook("error", async (error, context) => {
		const event = context?.event;

		if (!event) return;

		const Event = event as H3Event;
		const errorDetails = error as { statusCode?: number; statusMessage?: string; message?: string };
		const statusCode = errorDetails.statusCode ?? Event.node.res.statusCode;

		if (!Event.context.failTracked) trackFailure(Event, statusCode);

		Event.context.failTracked = true;
		const logger = await useCreateRequestLogger(Event);
		logger.finish();
	});

	nitroApp.hooks.hook("beforeResponse", async (event, { body }) => {
		if (!event) return;

		const Event = event as H3Event;
		const response = body as Record<string, any> | undefined;
		const status = event.node.res.statusCode;

		if (status >= 400) {
			trackFailure(Event, status);
			Event.context.failTracked = true;
			throw createError({
				statusCode: status,
				statusMessage: response?.status.message || response?.message || "Internal Server Error",
			});
		}

		if (response instanceof FetchError) return;
		const logger = await useCreateRequestLogger(Event);
		logger.finish();
	});
});
