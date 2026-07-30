export default defineSupabaseEventHandler(async (event) => {
	const filter = (getQuery(event).filter || "vandaag") as "vandaag" | "jaar" | "maand" | "week";
	const { startAt, endAt } = formulateDates(filter);

	const { data, error } = await useFetchAnalytics(`stats:${filter}`, {
		startAt,
		endAt,
		unit: "day",
		timezone: "Europe/Amsterdam",
	});

	if (error || !data) return useReturnResponse(event, internalServerError);

	const { data: devices, error: devicesError } = await useFetchMetrics(`device:${filter}`, {
		startAt,
		endAt,
		unit: "day",
		timezone: "Europe/Amsterdam",
		type: "device",
	});

	if (devicesError || !devices) return useReturnResponse(event, internalServerError);

	const deviceName = devices.length >= 1 ? devices.reduce((max, device) => (device.pageviews > max.pageviews ? device : max)).name : "Onbekend";

	const { data: pages, error: pagesError } = await useFetchMetrics(`path:${filter}`, {
		startAt,
		endAt,
		unit: "day",
		timezone: "Europe/Amsterdam",
		type: "path",
	});

	if (pagesError || !pages) return useReturnResponse(event, internalServerError);

	const pageName = pages.length >= 1 ? pages.reduce((max, page) => (page.pageviews > max.pageviews ? page : max)).name : "Onbekend";

	const { data: countries, error: countriesError } = await useFetchMetrics(`country:${filter}`, {
		startAt,
		endAt,
		unit: "day",
		timezone: "Europe/Amsterdam",
		type: "country",
	});

	if (countriesError || !countries) return useReturnResponse(event, internalServerError);

	const countryName = countries.length >= 1 ? countries.reduce((max, country) => (country.pageviews > max.pageviews ? country : max)).name : "Onbekend";

	const { data: eventsType1, error: eventsErrorType1 } = await useFetchEvents(`events:type-1:${filter}`, {
		startAt,
		endAt,
		unit: "day",
		timezone: "Europe/Amsterdam",
		pageSize: 200,
		eventType: 1,
	});

	if (eventsErrorType1 || !eventsType1) return useReturnResponse(event, internalServerError);

	const { data: eventsType2, error: eventsErrorType2 } = await useFetchEvents(`events:type-2:${filter}`, {
		startAt,
		endAt,
		unit: "day",
		timezone: "Europe/Amsterdam",
		pageSize: 200,
		eventType: 2,
	});

	if (eventsErrorType2 || !eventsType2) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			success: true,
			message: "Statistieken succesvol opgehaald",
		},
		data: {
			timeFrame: {
				startAt: new Date(startAt),
				endAt: new Date(endAt),
			},
			statistics: [
				{
					...calculateValues({
						label: "Unieke bezoekers",
						value: data.visitors,
						previous: data.comparison.visitors,
						color: "#6f97ed",
						icon: "akar-icons:person",
						format: false,
					}),
				},
				{
					...calculateValues({
						label: "Bezoeken",
						value: data.visits,
						previous: data.comparison.visits,
						color: "#2563eb",
						icon: "akar-icons:airplay-video",
						format: false,
					}),
				},
				{
					...calculateValues({
						label: "Weergaven",
						value: data.pageviews,
						previous: data.comparison.pageviews,
						color: "#1542a3",
						icon: "akar-icons:eye",
						format: false,
					}),
				},
				{
					...calculateValues({
						label: "Gem. sessieduur",
						value: data.totaltime / data.visits,
						previous: data.comparison.totaltime / data.comparison.visits,
						color: "#0c2970",
						icon: "akar-icons:alarm",
						format: true,
					}),
				},
			],

			metrics: {
				devices: {
					statistics: [
						{
							label: "Populairste",
							value: deviceName.charAt(0).toUpperCase() + deviceName.slice(1).toLowerCase(),
							color: "#1542a3",
							icon: "akar-icons:trophy",
							format: false,
						},

						{
							label: "Totale apparaten",
							value: devices.length,
							color: "#2563eb",
							icon: "akar-icons:grid",
							format: false,
						},
					],

					table: {
						categories: [
							{
								label: "Apparaat",
								value: "label",
								type: "string",
							},
							{
								label: "Weergaven",
								value: "weergaven",
								type: "number",
							},
							{
								label: "Bezoekers",
								value: "bezoekers",
								type: "number",
							},
							{
								label: "Bezoeken",
								value: "bezoeken",
								type: "number",
							},
							{
								label: "Bounces",
								value: "bounces",
								type: "number",
							},
							{
								label: "Sessie duur",
								value: "totaltime",
								type: "number",
							},
						],
					},

					chart: {
						categories: {
							desktop: {
								name: "Desktop",
								color: "#93c5fd",
							},
							mobile: {
								name: "Mobile",
								color: "#60a5fa",
							},
							laptop: {
								name: "Laptop",
								color: "#3b82f6",
							},
							tablet: {
								name: "Tablet",
								color: "#2563eb",
							},
						},
					},

					values: calculateMetrics(devices),
				},
				pages: {
					statistics: [
						{
							label: "Populairste",
							value: pageName === "/" ? "/index" : pageName,
							color: "#1542a3",
							icon: "akar-icons:trophy",
							format: false,
						},
						{
							label: "Totale pagina's",
							value: pages.length,
							color: "#2563eb",
							icon: "akar-icons:grid",
							format: false,
						},
					],

					table: {
						categories: [
							{
								label: "Pagina",
								value: "label",
								type: "string",
							},
							{
								label: "Weergaven",
								value: "weergaven",
								type: "number",
							},
							{
								label: "Bezoekers",
								value: "bezoekers",
								type: "number",
							},
							{
								label: "Bezoeken",
								value: "bezoeken",
								type: "number",
							},
							{
								label: "Bounces",
								value: "bounces",
								type: "number",
							},
							{
								label: "Sessie duur",
								value: "totaltime",
								type: "number",
							},
						],
					},

					chart: {
						categories: {
							bezoekers: {
								name: "Bezoekers",
								color: "#6f97ed",
							},
							weergaven: {
								name: "Weergaven",
								color: "#2563eb",
							},
							bezoeken: {
								name: "Bezoeken",
								color: "#1542a3",
							},
						},
					},

					values: calculateMetrics(pages),
				},

				events: {
					statistics: [
						{
							label: "Evenementen",
							value: eventsType2.concat(eventsType1).length,
							color: "#1542a3",
							icon: "akar-icons:sparkles",
							format: false,
						},
						{
							label: "Unieke evenementen",
							value: eventsType2 ? new Set(eventsType2.concat(eventsType1).map((event) => event.eventName)).size : 0,
							color: "#2563eb",
							icon: "akar-icons:grid",
							format: false,
						},
					],

					table: {
						categories: [
							{
								label: "Evenement",
								value: "label",
								type: "string",
							},
							{
								label: "Sessie",
								value: "session",
								type: "string",
							},
							{
								label: "Apparaat",
								value: "device",
								type: "string",
							},
							{
								label: "Browser",
								value: "browser",
								type: "string",
							},
							{
								label: "Aangemaakt",
								value: "created",
								type: "string",
							},
						],

						values: calculateEvents(eventsType2.concat(eventsType1)),
					},

					chart: {
						categories: {
							evenementen: {
								name: "Evenementen",
								color: "#1542a3",
							},
							weergaven: {
								name: "Weergaven",
								color: "#2563eb",
							},
						},
						values: calulateTimeLine(eventsType2.concat(eventsType1), filter),
					},
				},

				countries: {
					statistics: [
						{
							label: "Populairste",
							value: useCountryName(countryName),
							color: "#1542a3",
							icon: "akar-icons:trophy",
							format: false,
						},
						{
							label: "Totale landen",
							value: countries.length,
							color: "#2563eb",
							icon: "akar-icons:grid",
							format: false,
						},
					],

					table: {
						categories: [
							{
								label: "Laand",
								value: "label",
								type: "string",
							},
							{
								label: "Weergaven",
								value: "weergaven",
								type: "number",
							},
							{
								label: "Bezoekers",
								value: "bezoekers",
								type: "number",
							},
							{
								label: "Bezoeken",
								value: "bezoeken",
								type: "number",
							},
							{
								label: "Bounces",
								value: "bounces",
								type: "number",
							},
							{
								label: "Sessie duur",
								value: "totaltime",
								type: "number",
							},
						],
					},

					values: calculateMetrics(countries),
				},
			},
		},
	});
});
