<template>
	<fieldset>
		<legend class="sr-only">Categorieën filteren</legend>

		<div class="flex flex-wrap gap-3 mb-4 select-none">
			<button
				v-for="(category, key) in categories"
				:key="key"
				type="button"
				@click="toggleCategory(key)"
				:aria-pressed="!hiddenCategories.has(key)"
				:aria-label="`${hiddenCategories.has(key) ? 'Toon' : 'Verberg'} categorie ${category.name}`"
				class="flex items-center gap-2 text-sm transition-opacity rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
				:class="{
					'opacity-40': hiddenCategories.has(key),
				}">
				<span aria-hidden="true" class="w-3 h-3 rounded-full shrink-0" :style="{ background: category.color }"></span>

				<span>{{ category.name }}</span>
			</button>
		</div>

		<slot :disableToolTip :visible="visibleCategories" :filterData :filterDonut></slot>
	</fieldset>
</template>

<script setup lang="ts">
	const { categories } = defineProps<{
		categories: Record<string, { name: string; color: string }>;
	}>();

	const disableToolTip = computed(() => {
		return Object.entries(visibleCategories.value).length == 0;
	});

	const hiddenCategories = ref(new Set<string>());

	const toggleCategory = (category: string) => {
		if (hiddenCategories.value.has(category)) {
			hiddenCategories.value.delete(category);
		} else hiddenCategories.value.add(category);
	};

	const visibleCategories = computed(() => Object.fromEntries(Object.entries(categories).filter(([key]) => !hiddenCategories.value.has(key))));

	const filterData = (data: any[]) => {
		const entries = [...hiddenCategories.value];

		return data.map((item: any) => Object.fromEntries(Object.entries(item).filter(([key]) => !entries.includes(key))));
	};

	const filterDonut = (data: any[], active: ObjectKeys<TableMap["devices"]>) => {
		const entries = [...hiddenCategories.value];

		return data.map((item: any) => (!entries.includes(item.label.toLowerCase()) ? item[active] : undefined)).filter((item) => item != undefined);
	};
</script>
