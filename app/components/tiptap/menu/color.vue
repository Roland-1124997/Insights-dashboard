<template>
	<div v-if="openOptions && Array.isArray(options)" class="absolute right-0 z-10 flex flex-row items-center gap-1 p-1 mt-2 bg-white border rounded-lg md:right-auto md:left-0 top-8">
		<template v-for="(option, index) in options" :key="index">
			<div v-if="option.type === 'unset'" class="divider"></div>

			<button
				type="button"
				:title="option.title"
				class="flex items-center justify-between w-full gap-2 p-1 text-sm text-left transition rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none"
				:class="{
					'bg-blue-50 text-blue-700 ring-1 ring-blue-200': !!option.isActive?.(),
					'opacity-75': option.type === 'unset' && !option.isActive?.(),
				}"
				:aria-pressed="!!option.isActive?.()"
				@click="closeOptions(option.action)">
				<div v-if="option.type === 'set'" class="flex items-center min-w-0 gap-2">
					<div
						class="w-5 h-5 border rounded-full shrink-0"
						:style="{
							backgroundColor: option.color,
							borderColor: darkenColor(option.color, 30),
						}"></div>

					<span class="sr-only">{{ option.title }}</span>
				</div>

				<div v-else-if="option.type === 'unset'" class="flex items-center justify-center">
					<Icon name="fluent:circle-line-20-regular" class="text-black rotate-45" size="1.5em" />
					<span class="sr-only">{{ option.title }}</span>
				</div>

				<Icon v-if="option.isActive?.()" name="fluent:checkmark-16-filled" size="0.9em" class="text-blue-700" />
			</button>
		</template>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		options: {
			type: Array as PropType<
				{
					type: string;
					title: string;
					color: string;
					action: () => void;
					isActive?: () => boolean;
				}[]
			>,
			default: () => [],
		},
	});

	const openOptions = defineModel({ type: Boolean, default: false });

	const closeOptions = (callback: Function) => {
		callback();

		openOptions.value = false;
	};

	const darkenColor = (color: string, amount = 30) => {
		const [r, g, b] = color
			.replace("#", "")
			.match(/.{1,2}/g)!
			.map((value) => Number.parseInt(value, 16)) as [number, number, number];

		return `rgb(${Math.max(0, r - amount)}, ${Math.max(0, g - amount)}, ${Math.max(0, b - amount)})`;
	};
</script>

<style scoped>
	.divider {
		@apply bg-black h-5 mx-1 w-2;
	}
</style>
