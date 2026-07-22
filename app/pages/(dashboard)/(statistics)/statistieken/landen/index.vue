<template>
	<div>
		<h1 class="hidden mb-6 text-2xl font-bold md:flex">Landen Overzicht</h1>

		<section class="relative grid grid-cols-2 gap-3 mb-3 md:grid-cols-4">
			<template v-if="store.metrics?.countries.statistics">
				<ClientOnly>
					<UtilsAnalyticsQuickView :data="store.metrics?.countries.statistics || []" />
					<template #fallback>
						<UtilsAnalyticsSkeleton :visable :compact="true" />
					</template>
				</ClientOnly>
			</template>

			<template v-else>
				<UtilsAnalyticsSkeleton :visable :compact="true" />
			</template>
		</section>

		<UtilsTable name="countries" :data="store.metrics.countries.values || []" :categories />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - Statistieken Landen",
		description: "Bekijk alle statistieken van de landen, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
		ogTitle: "Insights - Statistieken Landen",
		ogDescription: "Bekijk alle statistieken van de landen, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
		ogUrl: "/statistieken/landen",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Statistieken Landen",
		twitterDescription: "Bekijk alle statistieken van de landen, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
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
			label: "Land",
			value: "label",
		},
		{
			label: "Weergaven",
			value: "weergaven",
		},
		{
			label: "Bezoekers",
			value: "bezoekers",
		},
		{
			label: "Bezoeken",
			value: "bezoeken",
		},
		{
			label: "Bounces",
			value: "bounces",
		},
		{
			label: "Sessie duur",
			value: "totaltime",
		},
	] as { label: string; value: TableRowValue }[];
</script>
