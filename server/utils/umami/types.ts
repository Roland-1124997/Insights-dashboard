export type AnalyticsQuery = {
	startAt: number;
	endAt: number;
	unit: "minute" | "hour" | "day" | "month" | "year";
	timezone: string;
	type?:
		| "path"
		| "entry"
		| "exit"
		| "title"
		| "query"
		| "referrer"
		| "channel"
		| "domain"
		| "country"
		| "region"
		| "city"
		| "browser"
		| "os"
		| "device"
		| "language"
		| "screen"
		| "event"
		| "hostname"
		| "tag";
	limit?: number;
	maxResults?: number;
	pageSize?: number;
	eventType?: number;
	filters?: {
		path?: string;
		referrer?: string;
		title?: string;
		query?: string;
		browser?: string;
		os?: string;
		device?: string;
		country?: string;
		region?: string;
		city?: string;
		hostname?: string;
		tag?: string;
		segment?: string;
		cohort?: string;
	};
};

type baseObject = {
	pageviews: number;
	visitors: number;
	visits: number;
	bounces: number;
	totaltime: number;
	uniqueEvents: number;
	events: number;
};

export type AnalyticsResponse = {
	label: string;
	name: string;
} & baseObject;

export type AnalyticsEventResponse = {
	id: string;
	eventName: string;
	hasData: boolean;
	device: string;
	browser: string;
	createdAt: string;
	eventType: number;
};

export type AnalyticsStatistics = {
	comparison: baseObject;
} & baseObject;
