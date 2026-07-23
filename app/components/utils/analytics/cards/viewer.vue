<template>
	<div>
		<UtilsTable @sorted="emitter" :name :data="data.slice(0, visable) || []" :categories :isSmall :isOpen :visable :loading />
	</div>
</template>

<script setup lang="ts">
	const { data, name, visable } = defineProps<{
		isSmall?: boolean;
		isOpen?: boolean;
		visable: number;
		data: TableMap["pages"][] | TableMap["countries"][] | TableMap["devices"][] | TableMap["events"][];
		name: "pages" | "countries" | "devices" | "events";
		loading?: boolean;
	}>();

	const emit = defineEmits<{
		(event: "emitter", value: { data: TableMap[TableName][]; name: string }): void;
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
			type: "string",
		},
	];

	const emitter = (value: TableMap[TableName][]) => {
		if (visable) emit("emitter", { data: value, name });
	};

	const metricsCategories = [
		{
			label: "Weergaven",
			value: "weergaven",
			type: "number",
		},
		{
			label: "Bezoekers",
			value: "bezoekers",
			type: "number",
		},
		{
			label: "Bezoeken",
			value: "bezoeken",
			type: "number",
		},
		{
			label: "Bounces",
			value: "bounces",
			type: "number",
		},
		{
			label: "Sessie duur",
			value: "totaltime",
			type: "number",
		},
	];

	const eventsCategories = [
		{
			label: "sessie",
			value: "session",
			type: "string",
		},
		{
			label: "Apparaat",
			value: "device",
			type: "string",
		},
		{
			label: "Browser",
			value: "browser",
			type: "string",
		},
		{
			label: "Aangemaakt",
			value: "created",
			type: "string",
		},
	];

	const categories = computed(() => {
		if (name === "events") return [...baseCategories, ...eventsCategories];
		return [...baseCategories, ...metricsCategories];
	}) as ComputedRef<{ label: string; value: TableRowValue; type: string }[]>;
</script>
