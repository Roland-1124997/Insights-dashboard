<template>
	<form @submit.prevent="submit" :class="direction === 'vertical' ? '' : 'space-y-6'">
		<slot :loading :errors="r$.$errors" :meta="{ valid: !r$.$invalid }"></slot>
	</form>
</template>

<script setup lang="ts">
	import type { ZodObject } from "zod";

	const { request, appendToBody, schema } = defineProps<{
		schema: {
			state: Record<string, unknown>;
			rules: ZodObject<Record<string, any>>;
		};
		request?: requestOptions<any>;
		appendToBody?: (values: Record<string, unknown>) => Promise<Record<string, unknown>>;
		direction?: "horizontal" | "vertical";
	}>();

	const emit = defineEmits<{
		submit: [values: Record<string, unknown>];
	}>();

	const state = ref<Record<string, unknown>>({ ...schema.state });
	const { r$ } = useRegleSchema(state, schema.rules);

	provide("regleForm", { state, r$ });

	const loading = ref(false);

	const submit = async () => {
		const result = await r$.$validate();
		if (!result.valid) return;

		const values = result.data as Record<string, unknown>;
		emit("submit", values);

		if (request) {
			loading.value = true;
			const { handleSubmit } = useHandleForm(request, appendToBody, r$);

			await handleSubmit(values);
			loading.value = false;
		}
	};
</script>
