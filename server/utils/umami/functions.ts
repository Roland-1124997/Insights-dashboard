const { UMAMI } = useRuntimeConfig();

const headers: HeadersInit = {
	"x-umami-share-token": UMAMI.SHARE_TOKEN,
	"x-umami-share-context": "1",
};

const baseUrl = `${UMAMI.HOST}`;

export const useFetchMetrics = async (key: string, query: AnalyticsQuery) => {
	const url = `${baseUrl}/metrics/expanded`;
	let data: AnalyticsResponse[] | null = null;
	let error = null;

	try {
		data = await useFetchCached(url, key, query);
	} catch (err) {
		error = err;
	}

	return { data, error };
};

export const useFetchAnalytics = async (key: string, query: AnalyticsQuery) => {
	const url = `${baseUrl}/stats`;
	let data: AnalyticsStatistics | null = null;
	let error = null;

	try {
		data = await useFetchCached(url, key, query);
	} catch (err) {
		error = err;
	}

	return { data, error };
};

export const useFetchEvents = async (key: string, query: AnalyticsQuery) => {
	const url = `${baseUrl}/events`;
	let data: AnalyticsEventResponse[] | null = null;
	let error = null;

	try {
		data = await useFetchCached(url, key, query);
	} catch (err) {
		error = err;
	}

	return { data, error };
};

const useFetchCached = defineCachedFunction(
	async (url: string, key: string, query: AnalyticsQuery) => {
		const data = await $fetch<any>(url, { headers, query });
		if (data.data) return data.data;
		return data;
	},
	{
		maxAge: 60 * 60 * 3,
		name: "analytics",
		getKey: (url: string, key: string, query: AnalyticsQuery) => `${key}-${query.timezone.split("/").join("-")}`,
	},
);

const setReferenceDate = (filter: "vandaag" | "week" | "maand" | "jaar", previous: boolean) => {
	const timezone = "Europe/Amsterdam";
	const nowDate = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));

	const referenceDate = new Date(nowDate);

	if (previous) {
		if (filter === "week") referenceDate.setDate(referenceDate.getDate() - 7);
		else if (filter === "maand") referenceDate.setMonth(referenceDate.getMonth() - 1);
		else if (filter === "jaar") referenceDate.setFullYear(referenceDate.getFullYear() - 1);
		else referenceDate.setDate(referenceDate.getDate() - 1);
	}

	return {
		year: referenceDate.getFullYear(),
		month: referenceDate.getMonth(),
		day: referenceDate.getDate(),
	};
};

const calculateStartAndEndDates = (filter: "vandaag" | "week" | "maand" | "jaar", year: number, month: number, day: number) => {
	let startAt = new Date(year, month, day, 0, 0, 0, 0).getTime();
	let endAt = new Date(year, month, day, 23, 59, 59, 999).getTime();

	if (filter === "week") {
		const currentDate = new Date(year, month, day);
		// getDay(): sunday = 0, monday = 1, ..., saturday = 6
		const mondayBasedDay = (currentDate.getDay() + 6) % 7;
		const weekStartDate = new Date(year, month, day - mondayBasedDay, 0, 0, 0, 0);
		const weekEndDate = new Date(weekStartDate);

		weekEndDate.setDate(weekStartDate.getDate() + 6);
		weekEndDate.setHours(23, 59, 59, 999);

		startAt = weekStartDate.getTime();
		endAt = weekEndDate.getTime();
	}

	if (filter === "maand") {
		startAt = new Date(year, month, 1, 0, 0, 0, 0).getTime();
		endAt = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();
	}

	if (filter === "jaar") {
		startAt = new Date(year, 0, 1, 0, 0, 0, 0).getTime();
		endAt = new Date(year, 11, 31, 23, 59, 59, 999).getTime();
	}

	return { startAt, endAt };
};

export const formulateDates = (filter: "vandaag" | "week" | "maand" | "jaar", previous: boolean = false) => {
	const { year, month, day } = setReferenceDate(filter, previous);
	return calculateStartAndEndDates(filter, year, month, day);
};

export const calculateMetrics = (metrics: AnalyticsResponse[]) => {
	const result = metrics.map((item) => {
		const label = item.name == "/" ? "/index" : item.name;

		return {
			label: label.charAt(0).toUpperCase() + label.slice(1),
			weergaven: {
				value: item.pageviews,
				type: "number",
			},
			bezoekers: {
				value: item.visitors,
				type: "number",
			},
			bezoeken: {
				value: item.visits,
				type: "number",
			},
			bounces: {
				value: Number(((item.bounces / item.visits) * 100).toFixed(0)),
				type: "percentage",
			},
			totaltime: {
				value: item.totaltime / item.visits,
				type: "duration",
			},
		};
	});

	result.sort((a, b) => b.weergaven.value - a.weergaven.value);

	return result;
};

export const calculateEvents = (events: AnalyticsEventResponse[]) => {
	const result = events.map((event) => {
		return {
			id: event.id,
			label: (event.eventName || "page_view").replace("#", ""),
			hasData: !!event.hasData,
			session: {
				value: `https://api.dicebear.com/10.x/glyphs/svg?seed=${event.sessionId}`,
				subtitle: event.sessionId.slice(0, 8),
				type: "image",
			},
			device: {
				value: event.device.charAt(0).toUpperCase() + event.device.slice(1),
				type: "plain",
			},
			browser: {
				value: event.browser == "ios" ? "Safari" : event.browser.charAt(0).toUpperCase() + event.browser.slice(1),
				type: "plain",
			},
			created: {
				value: event.createdAt,
				type: "relative",
			},
		};
	});

	result.sort((a, b) => new Date(b.created.value).getTime() - new Date(a.created.value).getTime());

	return result;
};

export const calculateValues = (options: { label: string; value: number; previous: number; color: string; icon: string; format: boolean }) => {
	const difference = calculateDifference(options.value, options.previous);
	const percentage = calculatePercentage(options.value, options.previous);
	const isPositive = positivePercentage(Number(percentage));

	return {
		label: options.label,
		value: options.value,
		difference: difference,
		percentage: percentage,
		positive: isPositive,
		color: options.color,
		icon: options.icon,
		format: options.format,
	};
};

export const positivePercentage = (value: number) => {
	if (value > 0) return true;
	return false;
};

export const calculateDifference = (current: number, previous: number, time: boolean = false) => {
	if (time) return (current - previous) / 10;
	return current - previous;
};

export const calculatePercentage = (current: number, previous: number) => {
	if (previous === 0) return 100;
	return (((current - previous) / previous) * 100).toFixed(0);
};

export const calulateTimeLine = (events: AnalyticsEventResponse[], filter: "vandaag" | "week" | "maand" | "jaar") => {
	const hours = Array.from({ length: 24 }, (_, hour) => `${hour.toString().padStart(2, "0")}:00`);
	const weekdays = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
	const months = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

	let timeline: { label: string | number; evenementen: number; weergaven: number }[] = [];

	if (filter === "vandaag") {
		timeline = hours.map((hour) => ({
			label: hour,
			weergaven: 0,
			evenementen: 0,
		}));
	}

	if (filter === "week") {
		timeline = weekdays.map((day) => ({
			label: day,
			weergaven: 0,
			evenementen: 0,
		}));
	}

	if (filter === "maand") {
		const now = new Date();

		const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		const currentMonth = now.getMonth() + 1;

		timeline = Array.from({ length: daysInMonth }, (_, day) => ({
			label: `${months[currentMonth - 1]} ${day + 1}`,
			weergaven: 0,
			evenementen: 0,
		}));
	}

	if (filter === "jaar") {
		timeline = months.map((month) => ({
			label: month,
			weergaven: 0,
			evenementen: 0,
		}));
	}

	for (const event of events) {
		const createdDate = new Date(event.createdAt);
		const eventType = event.eventType;

		if (filter === "vandaag") {
			const hour = createdDate.getHours();
			if (timeline[hour]) {
				timeline[hour].evenementen += 1;
				timeline[hour].weergaven += eventType === 1 ? 1 : 0;
			}
		} else if (filter === "week") {
			const day = createdDate.getDay() === 0 ? 6 : createdDate.getDay() - 1;

			timeline[day]!.evenementen += 1;
			timeline[day]!.weergaven += eventType === 1 ? 1 : 0;
		} else if (filter === "maand") {
			const date = createdDate.getDate() - 1;
			if (timeline[date]) {
				timeline[date].evenementen += 1;
				timeline[date].weergaven += eventType === 1 ? 1 : 0;
			}
		} else if (filter === "jaar") {
			const month = createdDate.getMonth();
			if (timeline[month]) {
				timeline[month].evenementen += 1;
				timeline[month].weergaven += eventType === 1 ? 1 : 0;
			}
		}
	}

	return timeline;
};
