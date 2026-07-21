<template>
	<div class="relative z-10">
		<article class="w-full col-span-1 p-6 space-y-4 border rounded-lg md:col-span-2">
			<div class="flex items-center justify-between mb-4">
				<div>
					<h2 class="text-xl font-bold text-gray-900">Profielinformatie</h2>
					<p class="mt-1 text-sm text-gray-600">Hier kun je je algemene profielinformatie bekijken en bewerken.</p>
				</div>
			</div>

			<div class="relative pt-5 bg-white border-t md:border md:p-5 md:rounded-xl">
				<div class="">
					<div class="w-full space-y-5">
						<div
							@input="onTitleInput"
							contenteditable
							class="mt-6 text-4xl outline-none font-extrabold focus:border-l-2 focus:pl-2 border-blue-800 leading-[0.9] text-blue-950 sm:text-5xl md:text-7xl">
							{{ algemeen.title }}
						</div>

						<div class="flex items-center gap-2 font-semibold text-blue-900 md:text-lg">
							<icon name="akar-icons:location" class="w-4 h-4 text-blue-700" aria-hidden="true" />
							<span class="border-blue-800 outline-none focus:border-l-2 focus:pl-2" @input="onLocatieInput" contenteditable>{{ algemeen.locatie }}</span>
						</div>

						<p @input="onSubtitleInput" contenteditable class="max-w-2xl text-base leading-7 border-blue-800 outline-none focus:border-l-2 focus:pl-2 text-slate-700 md:text-lg">
							{{ algemeen.subtitle }}
						</p>
					</div>

					<div class="sr-only" aria-hidden>
						<ClientOnly>
							<FormBase :schema="schema.profile.frontend" :request v-slot="{ loading }">
								<UtilsInput name="title" label="Titel" type="text" :required="true" :disabled="loading" :initial-value="updateded.title" />
								<UtilsInput name="locatie" label="locatie" type="text" :required="true" :disabled="loading" :initial-value="updateded.locatie" />
								<UtilsInput name="subtitle" label="Subtitel" type="text" :required="true" :disabled="loading" :initial-value="updateded.subtitle" />
							</FormBase>
						</ClientOnly>
					</div>
				</div>
			</div>
		</article>
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - Profiel",
		description: "Bekijk en bewerk je profielinformatie.",
		ogTitle: "Insights - Profiel",
		ogDescription: "Bekijk en bewerk je profielinformatie op Follio.",
		ogUrl: "/profile",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Profiel",
		twitterDescription: "Bekijk en bewerk je profielinformatie op Follio.",
		twitterImage: "/icons/icon_512-blue.png",
		twitterCard: "summary_large_image",
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

	const store = useProfile();

	const algemeen = computed(() => store.profile.algemeen);

	const updateded = reactive({
		title: algemeen.value.title,
		subtitle: algemeen.value.subtitle,
		locatie: algemeen.value.locatie,
	});

	const onTitleInput = (event: InputEvent) => {
		const target = event.target as HTMLElement;
		updateded.title = target.innerText;
	};

	const onSubtitleInput = (event: InputEvent) => {
		const target = event.target as HTMLElement;
		updateded.subtitle = target.innerText;
	};

	const onLocatieInput = (event: InputEvent) => {
		const target = event.target as HTMLElement;
		updateded.locatie = target.innerText;
	};

	const request: requestOptions = {
		url: "/api/profile",
		method: "patch",
	};
</script>
