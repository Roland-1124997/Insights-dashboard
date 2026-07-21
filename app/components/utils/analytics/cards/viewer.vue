<template>
	<div>
		<UtilsTable :name :data="data?.slice(0, visable) || []" :categories :isSmall :isOpen :visable :loading />
	</div>
</template>

<script setup lang="ts">
	const { data, name } = defineProps<{
		isSmall?: boolean;
		isOpen?: boolean;
		visable: number;
		data: TableMap["pages"][] | TableMap["countries"][] | TableMap["devices"][] | TableMap["events"][];
		name: "pages" | "countries" | "devices" | "events";
		loading?: boolean;
	}>();

	const tableName = computed(() => {
		if (name === "pages") return "Pagina";
		if (name === "countries") return "Land";
		if (name === "devices") return "Apparaat";
		if (name === "events") return "Evenement";
		return "Onbekend";
	});

	const baseCategories = [
		{
			label: tableName.value,
			value: "label",
		},
	];

	const metricsCategories = [
		{
			label: "Weergaven",
			value: "weergaven",
		},
		{
			label: "Bezoekers",
			value: "bezoekers",
		},
		{
			label: "Bezoeken",
			value: "bezoeken",
		},
		{
			label: "Bounces",
			value: "bounces",
		},
		{
			label: "Sessie duur",
			value: "totaltime",
		},
	];

	const eventsCategories = [
		{
			label: "Apparaat",
			value: "device",
		},
		{
			label: "Browser",
			value: "browser",
		},
		{
			label: "Aangemaakt",
			value: "created",
		},
	];

	const categories = computed(() => {
		if (name === "events") return [...baseCategories, ...eventsCategories];
		return [...baseCategories, ...metricsCategories];
	}) as ComputedRef<{ label: string; value: TableRowValue }[]>;
</script>
