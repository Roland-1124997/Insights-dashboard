<template>
	<section class="grid w-full grid-cols-1 mt-3 gap-y-3 md:gap-3 md:grid-cols-2 h-fit pb-[5.5rem] md:pb-0">
		<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-2">
			<div class="flex items-center justify-between mb-4">
				<div>
					<h2 class="text-xl font-bold text-gray-900">Actieve sleutels</h2>
					<p class="mt-1 text-sm text-gray-600">
						{{ data.length || 0 }} actieve
						{{ data.length === 1 ? "sleutel" : "sleutels" }}
					</p>
				</div>

				<div class="flex items-center gap-2">
					<UtilsButtonImportant description="ververs de lijst" icon-name="akar-icons:arrow-cycle" @click="security.refresh()" :loading="security.loading" :isButton="true" />
					<UtilsButtonImportant description="maak nieuwe token aan" icon-name="akar-icons:edit" @click="security.Create()" />
				</div>
			</div>

			<div>
				<UtilsTable name="tokens" :data="data" :categories="categories" :actions :visable="5" :loading="security.loading" />
			</div>
		</article>
	</section>
</template>

<script setup lang="ts">
	const { data } = defineProps<{
		data: TableMap["tokens"][];
	}>();

	const security = useSecurity();

	const categories = [
		{
			label: "naam",
			value: "naam",
			type: "string",
		},
		{
			label: "sleutel",
			value: "sleutel",
			type: "hidden",
		},
		{
			label: "vervaldatum",
			value: "vervaldatum",
			type: "date",
		},
		{
			label: "acties",
			value: "acties",
			type: "hidden",
		},
	] as { label: string; value: TableRowValue; type: string }[];

	const actions = [
		{
			name: "bekijken",
			icon: "akar-icons:eye",
			color: "gray-800",
			action: (row: TableMap["tokens"]) => {
				security.show(row);
			},
		},
		{
			name: "Verwijderen",
			icon: "akar-icons:trash-can",
			color: "red-600",
			action: (row: TableMap["tokens"]) => {
				security.Delete(row);
			},
		},
	] as any[];
</script>
