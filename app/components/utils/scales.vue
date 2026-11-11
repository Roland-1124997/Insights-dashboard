<script setup lang="ts">
	import type { HTMLAttributes } from "vue";

	interface Props {
		orientation?: "horizontal" | "vertical" | "diagonal";
		size?: number;
		color?: string;
		lineWidth?: number;
		class?: HTMLAttributes["class"];
		containerClass?: HTMLAttributes["class"];
	}

	const props = withDefaults(defineProps<Props>(), {
		orientation: "diagonal",
		size: 10,
		color: "rgba(0, 0, 0, 0.1)",
		lineWidth: 5,
	});

	const angles = {
		horizontal: "0deg",
		vertical: "90deg",
		diagonal: "135deg",
	};

	const patternStyle = computed(() => ({
		backgroundImage: `repeating-linear-gradient(
    ${angles[props.orientation]},
    ${props.color} 0,
    ${props.color} ${props.lineWidth}px,
    transparent ${props.lineWidth}px,
    transparent ${props.size}px
  )`,
		maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
		WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
	}));
</script>

<template>
	<div :class="['relative h-8 w-full overflow-hidden', props.containerClass]">
		<div :class="['pointer-events-none absolute inset-0', props.class]" :style="patternStyle"></div>
	</div>
</template>
