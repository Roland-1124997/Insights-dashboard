<template>
	<div>
		<UtilsTable @sorted="emitter" :name :data="data.values.slice(0, visable) || []" :categories="data.categories" :isSmall :isOpen :visable :loading />
	</div>
</template>

<script setup lang="ts">
	const { data, name, visable } = defineProps<{
		isSmall?: boolean;
		isOpen?: boolean;
		visable: number;
		data: {
			values: TableMap["pages"][] | TableMap["countries"][] | TableMap["devices"][] | TableMap["events"][];
			categories: { label: string; value: TableRowValue; type: string }[];
		};
		name: "pages" | "countries" | "devices" | "events";
		loading?: boolean;
	}>();

	const emit = defineEmits<{
		(event: "emitter", value: { data: TableMap[TableName][]; name: string }): void;
	}>();

	const emitter = (value: TableMap[TableName][]) => {
		if (visable) emit("emitter", { data: value, name });
	};
</script>
