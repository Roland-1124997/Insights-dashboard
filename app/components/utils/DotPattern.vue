<script setup lang="ts">
	interface DotPatternProps {
		width?: number;
		height?: number;
		x?: number;
		y?: number;
		cx?: number;
		cy?: number;
		cr?: number;
		className?: string;
		[key: string]: number | string | undefined;
	}
	const props = withDefaults(defineProps<DotPatternProps>(), {
		width: 16,
		height: 16,
		x: 0,
		y: 0,
		cx: 1,
		cy: 1,
		cr: 1,
	});

	const id = `pattern-${useId()}`;
</script>

<template>
	<svg aria-hidden="true" :class="cn('pointer-events-none fixed left-0 top-0 inset-0 h-full z-0 w-full fill-gray-400 ', props.className)" v-bind="props">
		<defs>
			<pattern :id="id" :width="props.width" :height="props.height" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse" :x="props.x" :y="props.y">
				<circle id="pattern-circle" :cx="props.cx" :cy="props.cy" :r="props.cr" />
			</pattern>
		</defs>
		<rect width="100%" height="100%" strokeWidth="0" :fill="`url(#${id})`" />
	</svg>
</template>
