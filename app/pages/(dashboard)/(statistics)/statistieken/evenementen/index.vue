<template>
	<div>
		<h1 class="hidden mb-6 text-2xl font-bold md:flex">Evenementen Overzicht</h1>

		<section class="relative grid grid-cols-2 gap-3 mb-3 md:grid-cols-4">
			<template v-if="store.metrics?.events.statistics">
				<ClientOnly>
					<UtilsAnalyticsQuickView :data="store.metrics?.events.statistics || []" />
					<template #fallback>
						<UtilsAnalyticsSkeleton :visable :compact="true" />
					</template>
				</ClientOnly>
			</template>

			<template v-else>
				<UtilsAnalyticsSkeleton :visable :compact="true" />
			</template>
		</section>

		<UtilsTable name="events" :data="store.metrics.events.values || []" :categories />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - Statistieken Pagina's",
		description: "Bekijk alle statistieken van de pagina's op je website, inclusief weergaven, bezoekers en bounces.",
		ogTitle: "Insights - Statistieken Pagina's",
		ogDescription: "Bekijk alle statistieken van de pagina's op je website, inclusief weergaven, bezoekers en bounces.",
		ogUrl: "/statistieken/paginas",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Statistieken Pagina's",
		twitterDescription: "Bekijk alle statistieken van de pagina's op je website, inclusief weergaven, bezoekers en bounces.",
		twitterImage: "/icons/icon_512-blue.png",
		twitterCard: "app",
	});

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
		link: [
			{
				rel: "icon",
				type: "image/png",
				href: "/icons/icon_512-blue.png",
			},
		],
	});

	const store = useAnalytics();
	const visable = ref(2);

	const categories = [
		{
			label: "Evenement",
			value: "label",
			type: "string",
		},
		{
			label: "sessie",
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
			type: "date",
		},
	] as { label: string; value: TableRowValue; type: string }[];
</script>
