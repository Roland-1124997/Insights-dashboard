<template>
	<div class="relative">
		<div class="relative w-full max-w-lg mx-auto md:max-w-xl">
			<div class="space-y-3">
				<h1 class="text-3xl font-bold tracking-tight text-gray-950 md:text-4xl">Verbind je GitHub met Insights</h1>
				<p class="max-w-lg text-sm leading-6 text-gray-600 md:text-base">Verbind je GitHub-account met Insights om je repositories te beheren en te synchroniseren.</p>
			</div>

			<div class="mt-8 mb-6 overflow-hidden bg-white border border-gray-200 shadow-sm rounded-3xl">
				<div class="relative flex flex-col min-h-56 md:flex-row">
					<div class="flex-1 p-6 md:p-7">
						<div class="flex items-start justify-between gap-4">
							<div>
								<p class="text-xs font-semibold tracking-wider text-gray-400 uppercase">Verbindingsstatus</p>
								<h2 class="mt-2 text-lg font-semibold leading-6 text-gray-900 md:text-xl">
									<span v-if="store.error">Verbinding mislukt</span>
									<span v-else-if="!store.loading">Succesvol verbonden</span>
									<span v-else>Verbinding controleren</span>
								</h2>
							</div>
							<span :class="['shrink-0 rounded-full px-2.5 py-1 text-xs font-medium', iconBgClass]">
								{{ store.error ? "Actie vereist" : store.loading ? "Bezig" : "Actief" }}
							</span>
						</div>
						<p class="mt-4 text-sm leading-6 text-gray-600">
							<span v-if="store.error">Er is een fout opgetreden bij het verbinden met GitHub. Probeer het opnieuw.</span>
							<span v-else-if="!store.loading">Je account is gekoppeld en de integratie wordt voorbereid.</span>
							<span v-else>We controleren de GitHub-verbinding. Dit kan enkele seconden duren.</span>
						</p>
						<div class="h-1 mt-6 overflow-hidden bg-gray-100 rounded-full">
							<div :class="['h-full rounded-full transition-all duration-500', store.error ? 'w-1/3 bg-red-500' : store.loading ? 'w-2/3 bg-blue-500 animate-pulse' : 'w-full bg-emerald-500']"></div>
						</div>
					</div>
				</div>
			</div>

			<div
				class="fixed bottom-0 left-0 z-10 flex items-center w-full gap-3 px-4 pt-4 pb-6 border-t bg-white/95 border-gray-200/80 backdrop-blur md:relative md:z-0 md:px-0 md:pt-0 md:pb-0 md:bg-transparent md:border-0 md:backdrop-blur-none">
				<button
					@click="buttonFunction"
					:disabled="store.loading"
					class="relative inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
					<span v-if="!store.loading" class="inline-flex items-center gap-2">
						<Icon name="akar-icons:circle-chevron-right-fill" />
						{{ store.error ? "Probeer opnieuw" : "Volgende" }}
					</span>
					<span v-else class="inline-flex items-center gap-2">
						<Icon name="akar-icons:arrow-cycle" class="animate-spin" />
						{{ store.error ? "Bezig met opnieuw proberen…" : "Bezig met verbinden…" }}
					</span>

					<span class="absolute flex items-center justify-center w-full h-full px-2 pointer-events-none">
						<UtilsScales color="rgb(255,255,255,0.2)" />
					</span>
				</button>

				<button
					@click="store.complete(false)"
					:disabled="!store.error"
					class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-[0.80rem] text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60 md:min-h-11">
					<icon name="akar-icons:cross" size="1.4rem" />
					<span class="sr-only">Annuleren</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - gitHub integratie",
		description: "Verbind je GitHub-account met Insights om je repositories te beheren.",
		ogTitle: "GitHub integratie",
		ogDescription: "Verbind je GitHub-account met Insights om je repositories te beheren.",
		ogUrl: "/auth/integrations/github",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "GitHub integratie",
		twitterDescription: "Verbind je GitHub-account met Insights om je repositories te beheren.",
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

	const store = useGithub();

	onMounted(async () => await store.init());

	const buttonFunction = computed(() => {
		if (store.error) return async () => await store.refresh();
		if (!store.error && !store.loading) return async () => await store.complete(true);
		return async () => {};
	});

	const iconBgClass = computed(() => {
		if (store.error) return "bg-red-100 text-red-600";
		if (!store.error && !store.loading) return "bg-emerald-100 text-emerald-600";
		return "bg-blue-100 text-blue-600";
	});
</script>
