<template>
	<field :name="name" v-slot="{ field, meta }: any">
		<div
			:class="
				meta.errors.length >= 1
					? 'border-red-200 bg-red/80 focus-within:border-red-500 focus-within:ring-red-400/40'
					: 'border-gray-200 bg-white/80 focus-within:border-blue-500 focus-within:ring-blue-400/40'
			"
			class="flex items-center w-full gap-2 px-3 py-2 overflow-x-auto overflow-y-hidden transition border flex-nowrap whitespace-nowrap rounded-xl focus-within:ring-2">
			<span
				v-for="topic in topics"
				:key="topic"
				:class="meta.errors.length >= 1 ? 'border-red-100 bg-red-50 text-red-700' : 'border-blue-100 bg-blue-50 text-blue-700'"
				class="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium">
				<button type="button" class="flex items-center" @click="removeTopic(topic)" :aria-label="`Verwijder onderwerp ${topic}`">
					<icon name="akar-icons:cross" class="w-3 h-3" aria-hidden="true" />
				</button>
				<span class="truncate" :title="topic">
					{{ topic }}
				</span>
			</span>

			<input
				:name="name"
				v-model="draftValue"
				type="text"
				:placeholder="placeholder"
				class="min-w-[8rem] flex-1 shrink-0 border-0 bg-transparent p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400"
				@input="handleInput"
				@keydown="handleKeydown" />

			<div class="sr-only">
				<input
					v-bind="field"
					:disabled
					:id="name"
					type="text"
					:placeholder="placeholder"
					class="min-w-[8rem] flex-1 border-0 bg-transparent p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400"
					@input="handleInput"
					@keydown="handleKeydown" />
			</div>
		</div>
	</field>
</template>

<script setup lang="ts">
	const { name, initialValue, placeholder } = defineProps<{
		name: string;
		placeholder?: string;
		initialValue?: string | string[] | number;
		disabled?: boolean;
	}>();

	const emit = defineEmits<{
		(event: "emitter", value: number): void;
	}>();

	const { value, setValue } = useField<string[] | string>(name);

	const normalizeTopics = (value: string | string[] | number | undefined) => {
		if (value === undefined || value === null || value === "") return [];
		if (typeof value === "number") return [String(value)];

		const topics = Array.isArray(value) ? value : value.split(",").map((topic: string) => topic.trim());
		return [...new Set(topics.filter(Boolean))];
	};

	const topics = computed<string[]>({
		get: () => normalizeTopics(value.value as string | string[] | number | undefined),
		set: (nextValue) => setValue(normalizeTopics(nextValue as string | string[] | number | undefined)),
	});

	watch(
		() => initialValue,
		(initial) => {
			setValue(normalizeTopics(initial as string | string[] | number | undefined));
		},
		{ immediate: true },
	);

	const draftValue = ref("");

	const commitTopic = () => {
		const nextValue = normalizeTopics([draftValue.value]);
		if (!nextValue.length) return;

		topics.value = [...topics.value, ...nextValue];
		draftValue.value = "";

		emit("emitter", topics.value.length);
	};

	const removeTopic = (topic: string) => {
		topics.value = topics.value.filter((item) => item !== topic);

		emit("emitter", topics.value.length);
	};

	const handleInput = (event: Event) => {
		const target = event.target as HTMLInputElement | null;
		draftValue.value = target?.value ?? "";
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === "Enter" && draftValue.value.trim()) {
			event.preventDefault();
			commitTopic();
			return;
		}

		if (event.key === "Backspace" && !draftValue.value) {
			const lastTopic = topics.value.at(-1);
			if (!lastTopic) return;

			event.preventDefault();
			removeTopic(lastTopic);
		}
	};
</script>

<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s ease;
	}
	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>
