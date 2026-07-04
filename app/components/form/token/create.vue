<template>
	<div class="w-full h-full">
		<Form @submit="(values) => props.onVerify(props, values)" :validationSchema="schema.token.frontend" v-slot="slotProps" class="flex flex-col max-h-[64vh] space-y-4">
			<UtilsInput name="name" label="Sleutel naam" placeholder="Naam van de sleutel" required />
			<UtilsInput name="expires_at" type="date" label="Vervaldatum" icon-name="akar-icons:alarm" />

			<button
				type="submit"
				class="flex items-center justify-center w-full gap-2 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 border-blue-600 outline-none select-none rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
				<icon name="akar-icons:save" class="w-5 h-5" aria-hidden="true" />
				<span>Verifiëren</span>
			</button>
		</Form>
	</div>
</template>

<script lang="ts" setup>
	const session = useSessions();
	const verified = ref();

	const { data } = await session.getSession();

	verified.value = data.data.factors.verified;

	const { props } = defineProps<{
		props: Record<string, any>;
	}>();
</script>
