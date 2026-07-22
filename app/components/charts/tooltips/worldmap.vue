<template>
	<div class="w-64 p-1 rounded-xl">
		<div class="flex items-center gap-1">
			<div v-if="values.count > 0" class="w-3 h-3 rounded-full" :style="localStyle"></div>
			<p class="font-bold text-normal">
				{{ useCountryName(values.id) }}
			</p>
		</div>

		<p v-if="values.count > 0" class="text-sm">In deze periode zijn de volgende statistieken geregistreerd:</p>
		<p v-else class="mb-4 text-sm text-gray-500">Er zijn geen statistieken geregistreerd voor dit land in deze periode.</p>

		<div v-if="values.count > 0" class="mt-4">
			<p class="text-sm text-gray-500">
				<strong>{{ useFormatDuration(values.count || 0) }}</strong> unieke bezoeker{{ values.count !== 1 ? "s" : "" }}
			</p>
			<p class="text-sm text-gray-500">
				<strong>{{ useFormatDuration(values.visits || 0) }}</strong> bezoek{{ values.visits !== 1 ? "en" : "" }}
			</p>
			<p class="text-sm text-gray-500">
				<strong>{{ useFormatDuration(values.views || 0) }}</strong> weergave{{ values.views !== 1 ? "s" : "" }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { values, areaColor } = defineProps({
		values: {
			type: Object,
			required: true,
		},
		areaColor: {
			type: Function,
			required: false,
			default: null,
		},
	});

	const localStyle = computed(() => {
		const color = areaColor ? areaColor(values) : "#dbeafe";

		return { background: color };
	});
</script>
