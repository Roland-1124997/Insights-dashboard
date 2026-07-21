<template>
	<tr class="transition-all hover:bg-gray-50 group">
		<th scope="row" class="flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-left text-gray-900 whitespace-nowrap">
			<div class="flex items-center gap-3">
				<icon :name="iconName(name, data.label)" aria-hidden="true" class="object-cover w-6 h-6 mr-2 text-blue-600 rounded-sm opacity-50 group-hover:opacity-100" />
				<span class="truncate w-fit max-w-48 md:max-w-fit">
					{{ displayName(name, data.label) }}
				</span>
			</div>

			<button
				type="button"
				@click="toggleExpanded"
				:aria-expanded="expanded"
				:aria-controls="getDetailsRowId(data.label)"
				:aria-label="getToggleButtonLabel(data.label)"
				:class="isSmall ? '' : 'md:hidden'"
				class="flex items-center justify-center p-1 rounded-sm opacity-70 group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
				<icon :name="expanded ? 'ri:arrow-up-s-fill' : 'ri:arrow-down-s-fill'" aria-hidden="true" class="object-cover w-6 h-6" />
			</button>
		</th>

		<UtilsTableRowInner :data="data" :categories="categories.slice(1, categories.length)" :name :decorator="decorator" :isSmall :isOpen :actions />
	</tr>

	<tr v-if="expanded" :class="isSmall ? '' : 'md:hidden'">
		<td :id="getDetailsRowId(data.label)" :colspan="categories.length" class="text-xs text-gray-600" role="region" :aria-label="`Details voor ${data.label}`">
			<table class="min-w-full">
				<caption class="sr-only">
					Details voor
					{{
						data.label
					}}
				</caption>
				<thead>
					<tr scope="row">
						<th
							v-for="category in categories.slice(1, categories.length - calculateRange(categories.length))"
							:key="category.value"
							scope="col"
							class="py-3 text-[0.65rem] font-medium tracking-wider text-center text-gray-700 uppercase">
							{{ category.label }}
						</th>
					</tr>
				</thead>

				<tbody>
					<tr>
						<UtilsTableRowInner :data="data" :categories="categories.slice(1, categories.length - calculateRange(categories.length))" :name :isSmall :isOpen :actions />
					</tr>
				</tbody>
			</table>
		</td>
	</tr>
</template>

<script setup lang="ts">
	const { isOpen } = defineProps({
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
			required: true,
		},
		actions: {
			type: Array as PropType<{ color: string; name: string; icon: string; action: (row: TableRowAnalytics | TableRowKeys) => void }[]>,
			default: () => [],
		},
	});

	const calculateRange = (len: number) => {
		if (len == 6) return 2;
		if (len == 5) return 1;
		if (len == 4) return 0;
		return 0;
	};

	const iconName = (name: string, label?: string) => {
		if (name === "countries" && label) return `twemoji:flag-${useCounryName(label, "en").replace(" ", "-").toLowerCase()}`;
		if (name === "devices") return "akar-icons:device-mobile";
		if (name === "tokens") return "ri:key-fill";

		return "ri:global-line";
	};

	const displayName = (name: string, label: string) => {
		if (name === "countries") return useCounryName(label);
		return label;
	};

	const expanded = ref<boolean>(isOpen || false);

	const getDetailsRowId = (label: string) => `row-details-${label.toLowerCase()}`;
	const getToggleButtonLabel = (label: string) => `${expanded.value ? "Verberg" : "Toon"} details voor ${label}`;
	const toggleExpanded = () => (expanded.value = !expanded.value);
</script>
