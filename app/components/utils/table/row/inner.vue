<template>
	<td v-for="category in categories" :key="category.value" class="py-3 text-sm text-center text-gray-700 border-t border-l first:border-l-0 whitespace-nowrap" :class="decorator?.()">
		<span v-if="category.value === 'acties'" class="flex items-center justify-center gap-2">
			<button
				v-for="action in actions"
				:key="action.name"
				@click="action.action(data)"
				:aria-label="`${action.name} ${data.label}`"
				:class="['flex items-center justify-center outline-none focus:opacity-100 p-1 text-sm font-medium rounded-sm opacity-70 hover:opacity-100 ', `text-${action.color}`]">
				<icon :name="action.icon" aria-hidden="true" class="object-cover w-5 h-5" />
			</button>
		</span>

		<span v-else>
			{{ formatCategoryValue(data, category.value) }}
		</span>
	</td>
</template>

<script setup lang="ts">
	defineProps({
		isSmall: {
			type: Boolean,
			default: false,
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String as PropType<"pages" | "countries" | "devices" | "tokens">,
			required: true,
		},
		data: {
			type: Object as PropType<TableRowAnalytics | TableRowKeys>,
			required: true,
		},
		categories: {
			type: Array<{ label: string; value: string }>,
			default: () => [],
		},
		decorator: {
			type: Function as PropType<() => string>,
			required: false,
		},
		actions: {
			type: Array as PropType<{ color: string; name: string; icon: string; action: (row: TableRowAnalytics | TableRowKeys) => void }[]>,
			default: () => [],
		},
	});

	type Type = "plain" | "date" | "duration" | "percentage" | "number";

	const formatCategoryValue = (data: any, category: string) => {
		const { value, type } = data[category] as { value: number | string; type: Type };

		if (type === "plain") return value;
		if (type === "date") return useFormatDate(String(value));

		if (type === "duration") return useFormatDuration(Number(value), true);
		if (type === "percentage") return `${useFormatDuration(Number(value))}%`;

		return useFormatDuration(Number(value));
	};
</script>
