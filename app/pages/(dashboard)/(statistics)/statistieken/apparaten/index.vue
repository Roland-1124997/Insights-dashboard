<template>
	<div>
		<h1 class="hidden mb-6 text-2xl font-bold md:flex">Apparaten Overzicht</h1>

		<section class="relative grid grid-cols-2 gap-3 mb-3 md:grid-cols-4">
			<template v-if="store.metrics.devices.statistics">
				<ClientOnly>
					<UtilsAnalyticsQuickView :data="store.metrics.devices.statistics || []" />
					<template #fallback>
						<UtilsAnalyticsSkeleton :visable :compact="true" />
					</template>
				</ClientOnly>
			</template>

			<template v-else>
				<UtilsAnalyticsSkeleton :visable :compact="true" />
			</template>
		</section>

		<UtilsTable name="devices" :data="store.metrics.devices.values || []" :categories :linked="false" />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - Statistieken Apparaten",
		description: "Bekijk alle statistieken van de apparaten, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
		ogTitle: "Insights - Statistieken Apparaten",
		ogDescription: "Bekijk alle statistieken van de apparaten, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
		ogUrl: "/statistieken/apparaten",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Statistieken Apparaten",
		twitterDescription: "Bekijk alle statistieken van de apparaten, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
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
	] as { label: string; value: TableRowValue; type: string }[];
</script>
