<template>
	<div class="w-full group">
		<label :class="hideLabel ? ' sr-only' : ''" class="flex items-center justify-between mb-2 text-sm font-medium text-gray-700 select-none" :for="name">
			<div>
				{{ label }}
				<span class="text-red-700">{{ required ? "* " : "" }}</span>
				<transition name="fade">
					<span v-if="fieldStatus?.$dirty && fieldStatus?.$errors?.length" class="text-red-700"> ({{ fieldStatus.$errors.find(Boolean) }}) </span>
				</transition>
			</div>

			<div aria-label="toggle wachtwoord" class="cursor-pointer select-none" v-if="type === 'password'" @click="togglePassword">
				<span v-if="showPassword"> Verberg </span>
				<span v-else> Toon </span>
			</div>
		</label>

		<div class="relative w-full">
			<span class="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none left-3">
				<Icon :name="iconName" size="1.1rem" />
			</span>
			<input
				:value="state[name]"
				@input="updateValue($event)"
				:disabled
				:id="name"
				:placeholder
				:type="inputType"
				autocomplete="on"
				class="w-full h-12 p-3 pl-10 text-gray-900 transition border appearance-none rounded-xl bg-white/80 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-400"
				:class="fieldStatus?.$dirty && fieldStatus?.$errors?.length ? 'focus:ring-red-500/60 focus:border-red-500/60 border-red-500 ' : 'focus:ring-indigo-500/60 focus:border-indigo-500/60'" />
		</div>
	</div>
</template>

<script setup lang="ts">
	const { type, name, initialValue } = defineProps({
		name: { type: String, required: true },
		label: { type: String, default: "text" },
		type: { type: String, default: "text" },
		placeholder: { type: String, default: "" },
		required: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		initialValue: { type: [String, Number, Array], default: "" },
		iconName: { type: String, default: "akar-icons:tag" },
		hideLabel: { type: Boolean, default: false },
	});

	const form = inject<{ state: Record<string, unknown>; r$: any }>("regleForm");
	const state = ref(form?.state ?? {}) as Ref<Record<string, any>>;
	const fieldStatus = computed(() => form?.r$?.[name]);

	const updateValue = (event: Event) => {
		const value = (event.target as HTMLInputElement).value;
		if (type === "number") {
			state.value[name] = value === "" ? null : Number(value);
			return;
		}

		if (type === "array") {
			state.value[name] = value
				.split(",")
				.map((item) => item.trim())
				.filter(Boolean);
			return;
		}

		state.value[name] = value;
	};

	watch(
		() => initialValue,
		(initial) => {
			if (type === "array") {
				state.value[name] = Array.isArray(initial)
					? [...new Set(initial.map((item) => String(item).trim()).filter(Boolean))]
					: typeof initial === "string"
						? [
								...new Set(
									initial
										.split(",")
										.map((item) => item.trim())
										.filter(Boolean),
								),
							]
						: [];
				return;
			}

			state.value[name] = initial;
		},
		{ immediate: true },
	);

	const inputType = computed(() => (type == "password" ? (showPassword.value ? "text" : "password") : type));

	const showPassword = ref(false);

	const togglePassword = () => {
		showPassword.value = !showPassword.value;
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
