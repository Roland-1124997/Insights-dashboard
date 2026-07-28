<template>
	<div>
		<ClientOnly v-if="metrics.events.table.values.length >= 1 && data.values.length >= 1">
			<div class="md:hidden">
				<ChartsLine :categories="data.categories" :data="data.values" :height="210" />
			</div>

			<div class="hidden md:block">
				<ChartsLine :categories="data.categories" :data="data.values" :height="310" />
			</div>

			<template #fallback>
				<div aria-hidden class="flex flex-col gap-3 h-[210px] mt-10 md:h-[310px] animate-pulse">
					<div class="flex h-full gap-2">
						<div class="flex-1 bg-gray-200 rounded"></div>
						<div class="flex-1 bg-gray-200 rounded"></div>
						<div class="flex-1 bg-gray-200 rounded"></div>
						<div class="flex-1 bg-gray-200 rounded"></div>
						<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
						<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
						<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
						<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
					</div>
				</div>
			</template>
		</ClientOnly>

		<template v-else>
			<div aria-hidden class="flex flex-col gap-3 h-[210px] mt-10 md:h-[310px] animate-pulse">
				<div class="flex h-full gap-2">
					<div class="flex-1 bg-gray-200 rounded"></div>
					<div class="flex-1 bg-gray-200 rounded"></div>
					<div class="flex-1 bg-gray-200 rounded"></div>
					<div class="flex-1 bg-gray-200 rounded md:flex"></div>
					<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
					<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
					<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
					<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
	const { data } = defineProps<{
		metrics: any;
		data: {
			categories: Record<string, { name: string; color: string }>;
			values: TableMap["events"][];
		};
	}>();

	const { filter } = useFilter() as any;
</script>
