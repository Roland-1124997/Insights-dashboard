<template>
	<div class="overflow-x-auto bg-white border border-gray-200 rounded-lg">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-4 py-3 text-sm font-medium tracking-wider text-left text-gray-700 uppercase">
						{{ categories[0]?.label }}
					</th>
					<th v-for="category in categories.slice(1, categories.length)" :key="category.value" :class="['py-3 text-sm font-medium tracking-wider text-center text-gray-700 uppercase', decorator()]">
						{{ category.label }}
					</th>
				</tr>
			</thead>
			<tbody v-if="data.length >= 1 && !loading" class="bg-white divide-y divide-gray-200">
				<ClientOnly>
					<UtilsTableRow v-for="(meta, index) in data" :key="`${meta.label}-${useId}`" :data="meta" :categories :name :decorator="decorator" :isSmall :isOpen :actions />

					<template #fallback>
						<UtilsTableRowSkeleton v-for="i in visable" :key="i" :categories :decorator="decorator" :isSmall :isOpen />
					</template>
				</ClientOnly>
			</tbody>
			<tbody v-else class="bg-white">
				<UtilsTableRowSkeleton v-for="i in visable" :key="i" :categories :decorator="decorator" :isSmall :isOpen />
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
	const { isSmall } = defineProps({
		loading: {
			type: Boolean,
			default: false,
		},
		visable: {
			type: Number,
			default: 10,
		},
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
			type: Array as PropType<TableMap[TableName][]>,
			required: true,
		},
		categories: {
			type: Array as PropType<{ label: string; value: TableRowValue }[]>,
			default: () => [],
		},
		actions: {
			type: Array as PropType<{ color: string; name: string; icon: string; action: (row: unknown) => void }[]>,
			default: () => [],
		},
	});

	const decorator = () => {
		if (isSmall) return "hidden";
		return "hidden md:table-cell";
	};
</script>
