import { getRequestURL, H3Event } from "h3";
import { FetchError } from "ofetch";

const { logging } = useRuntimeConfig();

const colors = {
	reset: "\x1b[0m",
	gray: "\x1b[90m",
	blue: "\x1b[36m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
};

const getContext = (event: H3Event) => {
	return {
		starttime: event.context.starttime as number,
		requestId: event.context.requestId as string,
		requestIp: event.context.requestIp as string,
	};
};

const createLogger = () => {
	let details: string[] = [];
	let event: H3Event;

	const init = (h3Event: H3Event) => {
		details = [];
		event = h3Event;

		return {
			set,
			finish,
		};
	};

	const set = (object: any) => {
		details.push(
			...Object.entries(object).map(([key, value]: [any, any]) => {
				return `${colors.blue}${key}:${colors.reset} ${colors.gray}${value}${colors.reset}`;
			}),
		);
	};

	const finish = () => {
		const { pathname } = getRequestURL(event);

		if (logging.exclude.some((route: string) => pathname.startsWith(route))) return;
		if (logging.include.length && !logging.include.some((route: string) => pathname.startsWith(route.replace("/**", "")))) return;

		const method = event.node.req.method ?? "GET";
		const status = event.node.res.statusCode;
		const duration = Math.round(performance.now() - event.context.starttime);

		const level = status >= 400 ? `${colors.red}ERROR${colors.reset}` : `${colors.blue}INFO${colors.reset}`;
		const statusColor = status >= 400 ? colors.red : colors.green;

		const base = [`${colors.gray}${timestamp()}${colors.reset} ${level} ${method} ${pathname} ${statusColor}${status}${colors.reset} ${colors.gray}in ${duration}ms${colors.reset}`];

		details.forEach((line, index) => {
			const prefix = index === details.length - 1 ? "└─" : "├─";
			base.push(`  ${prefix} ${line}`);
		});

		console.log(base.join("\n") + "\n" + `\u200B`);
	};

	return {
		init,
		set,
		finish,
	};
};

const timestamp = () => {
	const now = new Date();

	return (
		now.toLocaleTimeString("nl-NL", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		}) + `.${String(now.getMilliseconds()).padStart(3, "0")}`
	);
};

export default defineNitroPlugin((nitroApp) => {
	const log = createLogger();

	nitroApp.hooks.hook("request", (event) => {
		event.context.starttime = performance.now();
		event.context.requestId = crypto.randomUUID();

		const ip = getRequestIP(event, { xForwardedFor: true });
		if (ip) event.context.requestIp = ip;
	});

	nitroApp.hooks.hook("error", async (error, { event }) => {
		const Event = event as H3Event;

		const { requestId } = getContext(Event);

		log.init(Event).set({ requestId: requestId });

		log.finish();
	});

	nitroApp.hooks.hook("beforeResponse", (event, { body }) => {
		const Event = event as H3Event;
		const response = body as Record<string, any> | undefined;

		if (response instanceof FetchError) return;

		const { requestId } = getContext(Event);

		log.init(Event).set({ requestId: requestId });

		log.finish();
	});
});
