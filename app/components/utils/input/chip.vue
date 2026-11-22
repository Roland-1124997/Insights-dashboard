<template>
	<div :name="name" class="flex-1 min-w-0">
		<div
			:class="
				fieldStatus.$invalid
					? 'border-red-200 bg-red/80 focus-within:border-red-500 focus-within:ring-red-400/40'
					: 'border-gray-200 bg-white/80 focus-within:border-blue-500 focus-within:ring-blue-400/40'
			"
			class="flex items-center w-full gap-2 px-3 py-2 overflow-x-auto overflow-y-hidden transition border min-h-12 flex-nowrap whitespace-nowrap rounded-xl focus-within:ring-2">
			<span
				v-for="topic in topics"
				:key="topic"
				:class="fieldStatus.$invalid ? 'border-red-100 bg-red-50 text-red-700' : 'border-blue-100 bg-blue-50 text-blue-700'"
				class="inline-flex h-6 shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium">
				<button type="button" class="flex items-center" @click="removeTopic(topic)" :aria-label="`Verwijder onderwerp ${topic}`" :disabled="disabled">
					<icon name="akar-icons:cross" class="w-3 h-3" aria-hidden="true" />
				</button>
				<span class="truncate" :title="topic">
					{{ topic }}
				</span>
			</span>

			<input
				:id="name"
				:name="name"
				v-model="draftValue"
				type="text"
				:placeholder="placeholder"
				:disabled="disabled"
				:aria-invalid="fieldStatus.$invalid"
				class="min-w-[8rem] flex-1 shrink-0 border-0 bg-transparent p-0 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed"
				@keydown="handleKeydown" />
		</div>
	</div>
</template>

<script setup lang="ts">
	const { name, initialValue, placeholder, disabled } = defineProps<{
		name: string;
		placeholder?: string;
		initialValue?: string | string[] | number;
		disabled?: boolean;
	}>();

	const emit = defineEmits<{
		(event: "emitter", value: number): void;
	}>();

	const form = inject<{ state: Ref<Record<string, unknown>>; r$: any }>("regleForm");
	const state = form?.state ?? ref<Record<string, unknown>>({});
	const fieldStatus = computed(() => form?.r$?.[name]);

	const normalizeTopics = (value: string | string[] | number | undefined) => {
		if (value === undefined || value === null || value === "") return [];
		if (typeof value === "number") return [String(value)];

		const values = Array.isArray(value) ? value : value.split(",");
		return [...new Set(values.map((topic) => String(topic).trim()).filter(Boolean))];
	};

	const topics = computed<string[]>({
		get: () => normalizeTopics(state.value[name] as string | string[] | number | undefined),
		set: (nextValue) => {
			state.value[name] = normalizeTopics(nextValue);
		},
	});

	watch(
		() => initialValue,
		(initial) => {
			state.value[name] = normalizeTopics(initial);
		},
		{ immediate: true },
	);

	const draftValue = ref("");

	const commitTopics = (value = draftValue.value) => {
		const nextTopics = normalizeTopics(value);
		if (!nextTopics.length) return;

		topics.value = [...topics.value, ...nextTopics];
		draftValue.value = "";
		emit("emitter", topics.value.length);
	};

	const removeTopic = (topic: string) => {
		if (disabled) return;

		topics.value = topics.value.filter((item) => item !== topic);
		emit("emitter", topics.value.length);
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === "Enter" && draftValue.value.trim()) {
			event.preventDefault();
			commitTopics();
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
