<template>
	<td v-for="category in categories" :key="category.value" class="py-3 text-sm text-center text-gray-700 border-t border-l first:border-l-0 whitespace-nowrap" :class="decorator?.()">
		<div v-if="category.value === 'acties'" class="flex items-center justify-center gap-2">
			<button
				v-for="action in actions"
				:key="action.name"
				@click="action.action(data)"
				:aria-label="`${action.name} ${data.label}`"
				:class="['flex items-center justify-center outline-none focus:opacity-100 p-1 text-sm font-medium rounded-sm opacity-70 hover:opacity-100 ', `text-${action.color}`]">
				<icon :name="action.icon" aria-hidden="true" class="object-cover w-5 h-5" />
			</button>
		</div>

		<div v-else>
			<span v-if="isRelativeDate(category.value)" class="text-sm text-gray-500">
				<NuxtTime relative :datetime="getValues(category.value).value" />
			</span>

			<span v-else-if="isImage(category.value)" class="flex items-center w-full h-full justify-evenly">
				<img @error="imageError" :src="getValues(category.value).value" :alt="getValues(category.value).subtitle" class="object-cover rounded-full w-7 h-7" />
				<span class="hidden xl:flex"> {{ getValues(category.value).subtitle }}... </span>
			</span>

			<span v-else>
				{{ formatCategoryValue(category.value) }}
			</span>
		</div>
	</td>
</template>

<script setup lang="ts">
	const { data } = defineProps({
		isSmall: {
			type: Boolean,
			default: false,
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String as PropType<TableName>,
			required: true,
		},
		data: {
			type: Object as PropType<TableMap[TableName]>,
			required: true,
		},
		categories: {
			type: Array as PropType<{ label: string; value: TableRowValue }[]>,
			default: () => [],
		},
		decorator: {
			type: Function as PropType<() => string>,
			required: false,
		},
		actions: {
			type: Array as PropType<{ color: string; name: string; icon: string; action: (row: TableMap[TableName]) => void }[]>,
			default: () => [],
		},
	});

	const getValues = (input: TableRowValue) =>
		data[input as keyof typeof data] as unknown as {
			type: TableRowValueType;
			value: string;
			subtitle?: string;
		};

	const formatCategoryValue = (category: TableRowValue) => {
		const { type, value } = getValues(category);
		const skipTransform: TableRowValueType[] = ["plain", "relative", "image"];

		if (skipTransform.includes(type)) return value;
		if (type === "infinity") return "Onbepaald";

		if (type === "date") return useFormatDate(String(value));
		if (type === "duration") return useFormatDuration(Number(value), true);
		if (type === "percentage") return `${useFormatDuration(Number(value))}%`;

		return useFormatDuration(Number(value));
	};

	const isImage = (category: TableRowValue) => {
		const { type } = getValues(category);
		return type === "image";
	};

	const isRelativeDate = (category: TableRowValue) => {
		const { type } = getValues(category);
		return type === "relative";
	};

	const imageError = (event: Event) => {
		const target = event.target as HTMLImageElement;
		target.src = "/placeholder.png";
	};
</script>
