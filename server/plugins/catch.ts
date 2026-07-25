import { getRequestURL, H3Event } from "h3";
import { FetchError } from "ofetch";

const { logging } = useRuntimeConfig();

const blacklist = new Set<string>();
const requests = new Map();

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook("request", (event) => {
		const { pathname } = getRequestURL(event);

		event.context.starttime = performance.now();
		event.context.requestId = crypto.randomUUID();

		const ip = getRequestIP(event, { xForwardedFor: true });
		if (!ip) return;

		event.context.requestIp = ip;

		const isWordPressProbe = pathname.endsWith(".php") || pathname.startsWith("/wp-");

		if (isWordPressProbe) {
			const count = (requests.get(ip) ?? 0) + 1;
			requests.set(ip, count);

			if (count >= logging.limit) blacklist.add(ip);
		}

		event.context.blocked = blacklist.has(ip);

		if (event.context.blocked) {
			throw createError({
				statusCode: 403,
				statusMessage: "Forbidden",
			});
		}
	});

	nitroApp.hooks.hook("error", (error, { event }) => {
		const Event = event as H3Event;
		useCreateRequestLogger(Event).finish();
	});

	nitroApp.hooks.hook("beforeResponse", (event, { body }) => {
		const Event = event as H3Event;
		const response = body as Record<string, any> | undefined;

		if (response instanceof FetchError) return;
		useCreateRequestLogger(Event).finish();
	});
});
