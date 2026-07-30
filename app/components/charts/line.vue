<script setup lang="ts">
	const { data, height, categories } = defineProps({
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
	});

	const xFormatter = (tick: number): string => {
		return `${data[tick]?.label}`;
	};

	const hideTooltip = ref(false);

	watch(
		() => data,
		() => {
			hideTooltip.value = true;

			setTimeout(() => {
				hideTooltip.value = false;
			}, 50);
		},
	);
</script>

<template>
	<ChartsUtilsLegend :categories="categories" v-slot="{ visible, disableToolTip, filterData }">
		<AreaChart
			:padding="{
				top: 30,
				left: 0,
				right: 0,
				bottom: 30,
			}"
			:hideTooltip="hideTooltip || disableToolTip"
			:hide-legend="true"
			:height="height"
			:x-num-ticks="4"
			:data="filterData(data)"
			:categories="categories"
			:legend="false"
			:x-formatter="xFormatter"
			:y-grid-line="true"
			:curve-type="CurveType.Step"
			:crosshair-config="{
				color: '#1542a3',
				strokeColor: '#1542a3',
				strokeWidth: 1,
			}">
			<template #tooltip="{ values }">
				<ChartsTooltipsLine :categories="visible" v-if="values" :values="{ ...values }" />
			</template>
		</AreaChart>
	</ChartsUtilsLegend>
</template>
