<template>
	<aside class="pl-4 select-none">
		<nav class="mb-2 overflow-y-auto xl:inline">
			<h1 class="hidden mb-2 text-lg font-semibold xl:flex">Inhoudsopgave</h1>

			<div v-if="Anchors.length > 1" class="h-[42rem] md:h-[40rem] overflow-y-scroll">
				<ul class="flex flex-col mt-5 space-y-1 overflow-auto xl:mt-0">
					<TiptapTableContent :active-id="activeId" :on-item-click="onItemClick" v-for="node in Anchors" :key="node.id" :node="node" />
				</ul>
			</div>

			<p v-else class="text-gray-500">Geen inhoudsopgave beschikbaar.</p>
		</nav>
	</aside>
</template>

<script setup lang="ts">
	const activeId = defineModel<string | null>({ required: false, default: null });

	defineProps<{
		Anchors: Anchor[];
	}>();

	const onItemClick = (node: { id: string }) => {
		const element = document.getElementById(node.id);

		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
			activeId.value = node.id;
		}
	};
</script>
