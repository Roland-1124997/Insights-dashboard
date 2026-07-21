<script lang="ts" setup>
	const { data, height, categories, y_axis } = defineProps({
		data: {
			type: Object as () => TableMap[TableName][],
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
		y_axis: {
			type: Array as () => string[],
			required: true,
		},
	});

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

	const xFormatter = (i: number): string => `${data[i]?.label}`;
	const yFormatter = (tick: number) => tick.toString();
</script>

<template>
	<BarChart
		:data="localData"
		:height
		:categories
		:y-axis="y_axis"
		:group-padding="0"
		:bar-padding="0.2"
		:x-num-ticks="data.length - 1"
		:radius="4"
		:x-formatter="xFormatter"
		:y-formatter="yFormatter"
		:legend-position="LegendPosition.TopLeft"
		:hide-legend="false"
		:padding="{
			top: 30,
			left: 0,
			right: 0,
			bottom: 0,
		}"
		:y-grid-line="true">
		<template #tooltip="{ values }">
			<ChartsTooltipsGroup :categories="categories" :values="values" />
		</template>
	</BarChart>
</template>
