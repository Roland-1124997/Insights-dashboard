<template>
	<div
		v-for="article in articles"
		:key="article.id"
		class="group relative z-10 flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
		<div class="flex flex-col flex-1 p-5">
			<div class="flex items-start justify-between gap-4">
				<div class="flex-1 select-none">
					<div class="mb-2">
						<span
							class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
							:class="article.published ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'">
							<span class="h-1.5 w-1.5 rounded-full" :class="article.published ? 'bg-emerald-500' : 'bg-amber-500'" aria-hidden="true"></span>

							{{ article.published ? "Gepubliceerd" : "Concept" }}
						</span>
					</div>
				</div>

				<div class="flex shrink-0 items-center gap-1.5">
					<NuxtLink
						:to="`/artikelen/opstellen?edit=${article.id}`"
						class="flex items-center justify-center w-8 h-8 transition-colors border rounded-lg border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
						title="Bewerken"
						aria-label="Artikel bewerken">
						<icon name="akar-icons:edit" class="w-4 h-4" aria-hidden="true" />
					</NuxtLink>

					<button
						:aria-label="article.published ? 'Artikel op concept zetten' : 'Artikel publiceren'"
						@click="store.togglePublish(article)"
						class="flex items-center justify-center w-8 h-8 transition-colors border rounded-lg border-slate-200 bg-slate-50 text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
						:title="article.published ? 'Op concept zetten' : 'Publiceren'">
						<icon :name="article.published ? 'akar-icons:toggle-on' : 'akar-icons:toggle-off'" class="w-4 h-4" aria-hidden="true" />
					</button>

					<button
						aria-label="Artikel verwijderen"
						@click="store.remove(article.id)"
						class="flex items-center justify-center w-8 h-8 transition-colors border rounded-lg border-slate-200 bg-slate-50 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
						title="Verwijderen">
						<icon name="akar-icons:trash-can" class="w-4 h-4" aria-hidden="true" />
					</button>
				</div>
			</div>

			<h2 class="w-full mt-4 text-xl font-bold tracking-tight line-clamp-2 text-slate-900">
				{{ article.title }}
			</h2>

			<hr class="h-px my-4 bg-slate-100" />

			<p class="line-clamp-3 min-h-[3.75rem] text-sm leading-6 text-slate-600">
				{{ article.description || "Geen beschrijving beschikbaar." }}
			</p>

			<div v-if="article.topics?.length" class="mt-4 select-none flex min-h-7 flex-wrap gap-1.5">
				<span
					v-for="topic in article.topics"
					:key="topic"
					class="inline-flex items-center gap-1 rounded-full border-blue-800 border px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/10">
					<icon name="akar-icons:hashtag" class="w-3 h-3" aria-hidden="true" />
					{{ topic }}
				</span>
			</div>

			<div class="pt-5 mt-auto select-none">
				<div class="flex flex-wrap items-center pt-4 text-xs border-t gap-x-4 gap-y-2 border-slate-100 text-slate-500">
					<span v-if="article.words" class="inline-flex items-center gap-1.5" aria-label="Aantal woorden">
						<icon name="akar-icons:file" class="h-3.5 w-3.5" aria-hidden="true" />
						{{ article.words }} woorden
					</span>

					<span v-if="article.read_time" class="inline-flex items-center gap-1.5" aria-label="Gemiddelde leestijd">
						<icon name="akar-icons:clock" class="h-3.5 w-3.5" aria-hidden="true" />
						{{ article.read_time }} min lezen
					</span>

					<span v-if="article.updated_at" class="inline-flex items-center gap-1.5" aria-label="Laatst aangepast op">
						<icon name="akar-icons:history" class="h-3.5 w-3.5" aria-hidden="true" />
						<NuxtTime :datetime="article.updated_at" year="numeric" month="short" day="numeric" />
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		articles: Article[];
	}>();

	const store = useArticles();
</script>
