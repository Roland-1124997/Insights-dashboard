<template>
	<div class="w-full mb-3 md:mb-auto">
		<div class="flex flex-col w-full h-full p-4 transition-all duration-200 border border-gray-200 shadow-sm rounded-2xl bg-white/90">
			<div class="flex items-start justify-between gap-3 mb-3">
				<div>
					<p class="text-sm font-semibold text-gray-800">Onderwerpen</p>
					<p class="text-xs text-gray-500">Voeg relevante onderwerpen toe om de druk op Enter om meerdere onderwerpen toe te voegen.</p>
				</div>

				<div v-if="counter >= 1" class="rounded-full flex items-center gap-1 border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
					{{ counter }}
					<icon name="akar-icons:hashtag" class="w-3 h-3" aria-hidden="true" />
				</div>
			</div>

			<Form :validation-schema="schema.topics.frontend" @submit="props.onConfirm" class="flex w-full gap-2">
				<UtilsInputChip name="topics" :initial-value="topics" placeholder="Bijv. marketing, content, analytics" @emitter="increment" />

				<button
					type="submit"
					class="flex aspect-square items-center justify-center gap-2 p-[0.60rem] text-sm font-medium transition-colors duration-200 border rounded-lg outline-none w-fit bg-blue-600 text-blue-100 border-blue-500 hover:bg-blue-700 hover:text-blue-100 focus:text-blue-100 focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
					aria-label="Nieuwe onderwerp toevoegen">
					<icon name="akar-icons:plus" size="1.8em" aria-hidden="true" />
					<span class="sr-only"> Voeg toe </span>
				</button>
			</Form>

			<div class="p-4 mt-4 space-y-3 rounded-lg bg-gray-50">
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-gray-700"> Snelle acties </span>
					<div class="p-1 px-3 text-sm bg-gray-200 rounded-xl">Optioneel</div>
				</div>
				<button @click="paste" class="flex items-center justify-start w-full gap-2 pl-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 h-9">
					<icon name="akar-icons:copy" size="1.2em"></icon>
					<span class="text-sm font-medium"> Plak uit klembord </span>
				</button>
			</div>
			<div v-if="error" class="mt-1 text-sm font-medium text-gray-700">
				<transition name="fade">
					<div class="py-3 text-red-700">{{ message }}</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { props } = defineProps<{
		props: Record<string, any>;
	}>();

	const topics = ref<string[]>(props.topics);
	const counter = ref<number>(topics.value.length);

	const { data, error, message, paste } = await useClipboard();

	watch(
		() => data.value,
		(newValue) => {
			if (newValue) {
				const pastedTopics = newValue.split(",").map((topic: string) => topic.trim());
				topics.value = [...new Set([...topics.value, ...pastedTopics])];
				counter.value = topics.value.length;
			}
		},
	);

	const increment = (value: number) => {
		counter.value = value;
	};
</script>
