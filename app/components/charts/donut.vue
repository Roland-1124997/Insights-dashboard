<script setup lang="ts">
	const { data, height, categories, active } = defineProps({
		data: {
			type: Array as () => TableMap["devices"][],
			required: true,
		},
		height: {
			type: Number,
			default: 225,
		},
		categories: {
			type: Object as () => Record<string, { name: string; color: string }>,
			required: true,
		},
		arcWidth: {
			type: Number,
			default: 40,
		},
		active: {
			type: String as PropType<ObjectKeys<TableMap["devices"]>>,
			required: false,
			default: "bezoekers",
		},
	});

	const localCategories = computed(() => {
		const availableCategories: Record<string, { name: string; color: string }> = {};

		data.forEach((item) => {
			const key = item.label.toLowerCase();
			if (categories[key]) availableCategories[key] = categories[key];
		});

		return availableCategories;
	});

	// const localData = computed(() => {
	// 	return data.map((item) => item[active].value);
	// });

	const localData = computed((): Record<string, string>[] =>
		data.map((item) => {
			const entries = Object.entries(item);
			const [, label] = entries.shift() as [unknown, string];
			const values = Object.fromEntries((entries as [string, { value: number | string }][]).map(([key, value]) => [key, value.value]));

			return {
				label,
				...values,
			};
		}),
	);
</script>

<template>
	<ChartsUtilsLegend :categories="localCategories" v-slot="{ visible, filterDonut }">
		<div class="mt-9">
			<DonutChart
				:data="filterDonut(localData, active)"
				:height
				:categories="localCategories"
				:radius="160"
				:pad-angle="0.1"
				:arc-width="arcWidth"
				:hide-legend="true"
				:legend-style="{ marginBottom: '2rem' }">
				<div class="text-center">
					<div class="text-lg font-semibold capitalize">{{ active }}</div>
					<div class="text-muted">
						{{ useFormatDuration(filterDonut(localData, active).reduce((a, b) => a + b, 0)) }}
					</div>
				</div>

				<template #tooltip="{ values }">
					<ChartsTooltipsDonut v-if="values" :categories="categories" :active="active" :values="values" />
				</template>
			</DonutChart>
		</div>
	</ChartsUtilsLegend>
</template>
