<template>
	<div>
		<h1 class="hidden mb-6 text-2xl font-bold md:flex">
			Stedelijk overzicht
		</h1>

		<section class="relative grid grid-cols-2 gap-3 mb-3 md:grid-cols-4">
			<template v-if="store.metrics?.cities.statistics">
				<ClientOnly>
					<UtilsAnalyticsQuickView :data="store.metrics?.cities.statistics || []" />
					<template #fallback>
						<UtilsAnalyticsSkeleton :visable :compact="true" />
					</template>
				</ClientOnly>
			</template>

			<template v-else>
				<UtilsAnalyticsSkeleton :visable :compact="true" />
			</template>
		</section>

		<UtilsTable name="cities" :data="store.metrics.cities.table.values || []" :categories="store.metrics.cities.table.categories" :linked="false" />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - Statistieken steden",
		description: "Bekijk alle statistieken van de steden, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
		ogTitle: "Insights - Statistieken steden",
		ogDescription: "Bekijk alle statistieken van de stden, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
		ogUrl: "/statistieken/steden",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Statistieken steden",
		twitterDescription: "Bekijk alle statistieken van de steden, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
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
</script>
