import { getRequestURL, H3Event } from "h3";

const { logging, production } = useRuntimeConfig();

const createLogger = (event: H3Event) => {
	let details: string[] = [];

	const set = (object: Record<string, unknown>) => {
		Object.entries(object).forEach(([key, value]) => {
			details.push(`${colors.blue}${key}:${colors.reset} ${colors.gray}${String(value)}${colors.reset}`);
		});

		return {
			set,
			finish,
		};
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

		if (production) console.log(base.join("\n") + "\n" + `\u200B`);
	};

	return {
		set,
		finish,
	};
};

const colors = {
	reset: "\x1b[0m",
	gray: "\x1b[90m",
	blue: "\x1b[36m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
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

export const useCreateRequestLogger = (event: H3Event) => {
	const log = createLogger(event);

	log.set({ requestId: event.context.requestId });
	if (event.context.requestIp) log.set({ ip: event.context.requestIp });

	return log;
};
