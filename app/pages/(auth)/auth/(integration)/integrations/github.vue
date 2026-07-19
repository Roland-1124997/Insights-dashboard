<template>
	<div class="flex items-center justify-center px-4 py-8">
		<div class="w-full max-w-4xl p-8 bg-white border border-gray-200 shadow-sm rounded-3xl">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 class="text-2xl font-semibold text-gray-800">GitHub integratie</h1>
					<p class="mt-3 text-sm leading-6 text-gray-600">
						<span v-if="store.error">Er is een fout opgetreden bij het verbinden met GitHub. Probeer het opnieuw.</span>
						<span v-else-if="!store.error && !store.loading"> De GitHub-verbinding is succesvol voltooid. Je account is nu gekoppeld aan GitHub </span>
						<span v-else>We controleren de GitHub-verbinding. Dit kan enkele seconden duren.</span>
					</p>
				</div>
			</div>

			<div class="p-6 mt-8 mb-6 border border-gray-200 rounded-2xl bg-gray-50">
				<div class="grid items-start gap-4 xl:items-center xl:flex">
					<div :class="['relative flex h-16 w-16 items-center justify-center rounded-full', iconBgClass]">
						<div v-if="store.loading" class="absolute inset-0 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
						<icon name="akar-icons:github-fill" size="1.75rem" :class="iconClass" />
					</div>

					<div>
						<h2 class="text-lg font-semibold text-gray-900">
							<span v-if="store.error">De GitHub-verbinding kon niet worden voltooid</span>
							<span v-else-if="!store.error && !store.loading">GitHub is succesvol verbonden</span>
							<span v-else>We controleren de GitHub-verbinding</span>
						</h2>
						<p class="mt-1 text-sm text-gray-600">
							<span v-if="store.error">Er is een fout opgetreden bij het verbinden met GitHub. Probeer het opnieuw.</span>
							<span v-else-if="!store.error && !store.loading">Je account is nu gekoppeld aan GitHub en de integratie wordt voorbereid.</span>
							<span v-else>We controleren de GitHub-verbinding. Dit kan enkele seconden duren.</span>
						</p>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-3 sm:flex-row">
				<button
					:disabled="store.loading"
					@click="buttonFunction"
					:class="[
						'relative inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-white transition rounded-xl focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60',
						buttonClass,
					]">
					<span v-if="!store.loading" class="inline-flex items-center gap-2">
						<Icon name="akar-icons:circle-chevron-right-fill" />
						{{ store.error ? "Probeer opnieuw" : "Volgende" }}
					</span>
					<span v-else class="inline-flex items-center gap-2">
						<Icon name="akar-icons:arrow-cycle" class="animate-spin" />
						{{ store.error ? "Bezig met opnieuw proberen…" : "Bezig met verbinden…" }}
					</span>
				</button>

				<button
					:disabled="!store.error"
					type="button"
					@click="store.complete(false)"
					class="relative inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-gray-600 transition border border-gray-300 hover:border-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-60">
					<span class="inline-flex items-center gap-2">
						<Icon name="akar-icons:cross" />
						Annuleren
					</span>
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

	const buttonClass = computed(() => {
		if (store.error) return "bg-red-600 hover:bg-red-700 focus:ring-red-300";
		if (!store.error && !store.loading) return "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-300";
		return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-300";
	});

	const iconBgClass = computed(() => {
		if (store.error) return "bg-red-100 text-red-600";
		if (!store.error && !store.loading) return "bg-emerald-100 text-emerald-600";
		return "bg-blue-100 text-blue-600";
	});

	const iconClass = computed(() => {
		if (store.error) return "text-red-600";
		if (!store.error && !store.loading) return "text-emerald-600";
		return "text-blue-600";
	});
</script>
