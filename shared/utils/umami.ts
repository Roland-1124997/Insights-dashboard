export const useFormatDuration = (value: number, format: boolean = false) => {
	if (!format) {
		return new Intl.NumberFormat("nl-NL", {
			notation: "compact",
			maximumFractionDigits: 2,
		})
			.format(value)
			.replace("NaN", "0");
	}

	const hours = Math.floor(value / 3600);
	const minutes = Math.floor((value % 3600) / 60);
	const seconds = Math.floor(value % 60)
		.toString()
		.padStart(2, "0")
		.replace("-", "")
		.replace("NaN", "00");

	if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;

	return `${minutes}m ${seconds}s`;
};

export const useFormatDate = (date: string) => {
	return new Intl.DateTimeFormat("nl-NL", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date(date));
};

export const formatWeeklyStatsMessage = (stats: any) => {
	const { pageviews, visitors } = stats;

	return {
		title: "Wekelijkse statistieken",
		message: `Afgelopen week zijn er ${useFormatDuration(pageviews)} weergaven, ${useFormatDuration(visitors)} bezoekers geweest`,
	};
};
