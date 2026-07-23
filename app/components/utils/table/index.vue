<template>
	<div class="overflow-x-auto bg-white border border-gray-200 rounded-lg">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th class="flex items-center gap-2 px-4 py-3 text-sm font-medium tracking-wider text-left text-gray-700 uppercase">
						{{ categories[0]?.label }}

						<icon name="akar-icons:filter" class="w-3 h-3 text-gray-400 cursor-pointer" @click="sortByLabel()" aria-label="Sorteer op label" />
					</th>
					<th v-for="category in categories.slice(1, categories.length)" :key="category.value" :class="['py-3 text-sm font-medium tracking-wider text-center text-gray-700 uppercase', decorator()]">
						{{ category.label }}

						<icon
							v-if="category.type !== 'hidden'"
							name="akar-icons:filter"
							class="w-3 h-3 text-gray-400 cursor-pointer"
							@click="sortByCategory(category.value, category.type)"
							aria-label="Sorteer op label" />
					</th>
				</tr>
			</thead>
			<tbody v-if="tableData.length >= 1 && !loading" class="bg-white divide-y divide-gray-200">
				<ClientOnly>
					<UtilsTableRow v-for="meta in tableData" :key="useId()" :data="meta" :categories :name :decorator="decorator" :isSmall :isOpen :actions />

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
	const { isSmall, data, name, categories, linked } = defineProps({
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
			type: Array as PropType<{ label: string; value: TableRowValue; type: string }[]>,
			default: () => [],
		},
		actions: {
			type: Array as PropType<{ color: string; name: string; icon: string; action: (row: unknown) => void }[]>,
			default: () => [],
		},
		linked: {
			type: Boolean,
			default: true,
		},
	});

	const emit = defineEmits<{
		(event: "sorted", value: TableMap[TableName][]): void;
	}>();

	const decorator = () => {
		if (isSmall) return "hidden";
		return "hidden md:table-cell";
	};

	const tableData = ref<TableMap[TableName][]>([]);

	watch(
		() => data,
		(value) => {
			tableData.value = linked ? value : [...value];
		},
		{ immediate: true },
	);

	const sortDirection = ref<"asc" | "desc" | "default">("asc");

	const nextDirection = {
		default: "asc",
		asc: "desc",
		desc: "default",
	} as const;

	const defaultSort = (a: any, b: any): number => {
		if (name === "events") return new Date(b.created.value).getTime() - new Date(a.created.value).getTime();
		else if (name === "tokens") return new Date(b.vervaldatum.value).getTime() - new Date(a.vervaldatum.value).getTime();
		else return b.weergaven.value - a.weergaven.value;
	};

	const sortData = (items: TableMap[TableName][], options?: { category: string; type: string }) => {
		const { category, type } = options || {
			category: "label",
			type: "string",
		};

		const result = linked ? items : [...items];

		result.sort((a: any, b: any) => {
			const aValue = a[category]?.value ?? a[category];
			const bValue = b[category]?.value ?? b[category];

			if (sortDirection.value === "default") return defaultSort(a, b);

			if (sortDirection.value === "asc") {
				if (type === "string") return aValue.localeCompare(bValue);
				if (type === "date") return new Date(aValue).getTime() - new Date(bValue).getTime();
				return aValue - bValue;
			}

			if (type === "string") return bValue.localeCompare(aValue);
			if (type === "date") return new Date(bValue).getTime() - new Date(aValue).getTime();
			return bValue - aValue;
		});

		if (!linked) tableData.value = result;

		if (type === "date" && sortDirection.value === "desc") sortDirection.value = nextDirection.default;
		else sortDirection.value = nextDirection[sortDirection.value];

		emit("sorted", result);
	};

	const sortByCategory = (category: TableRowValue, type: string) => {
		sortData(tableData.value, { category, type });
	};

	const sortByLabel = () => {
		sortData(tableData.value);
	};
</script>
