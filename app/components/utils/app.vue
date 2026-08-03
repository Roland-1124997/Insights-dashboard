<template>
	<div :class="!disablePwaPrompt ? 'flex-col' : 'flex'" class="fixed top-0 left-0 flex items-start justify-center w-full h-screen overflow-hidden">
		<ClientOnly>
			<UtilsInstallPrompt v-if="!disablePwaPrompt" />
		</ClientOnly>

		<div :class="installed ? 'pt-[2.5rem] md:pt-[1rem] xl:pt-0' : ''" class="flex w-full h-full overflow-hidden">
			<slot></slot>
		</div>

		<ClientOnly>
			<UtilsToast v-if="!disableToast" />
		</ClientOnly>

		<div class="fixed z-[100] w-screen h-screen pointer-events-none">
			<div class="pointer-events-auto">
				<ClientOnly>
					<Modal />
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		disablePwaPrompt: {
			type: Boolean,
			default: false,
		},
		disableToast: {
			type: Boolean,
			default: false,
		},
	});

	const { installed } = useCheckPwa();
</script>
