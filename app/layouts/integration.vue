<template>
	<UtilsApp :disablePwaPrompt="true" :disableToast="true">
		<div class="flex flex-col flex-1 w-full overflow-hidden">
			<header class="z-40 flex items-center justify-between h-16 px-4 bg-white border-b lg:px-6">
				<div class="flex items-center gap-4">
					<div class="flex items-center space-x-3">
						<div class="flex items-center justify-center w-8 h-8 overflow-hidden bg-blue-600 rounded-lg">
							<img src="\svgs\icon_512-blue.svg" alt="Insights Logo" draggable="false" class="rounded-lg w-7 h-7" />
						</div>
						<h1 class="text-xl font-bold text-blue-950">Insights</h1>
					</div>
				</div>
				<div class="sticky top-0 left-0 flex items-center justify-between w-full gap-2 p-1"></div>
			</header>
			<div class="flex flex-col flex-1 w-full overflow-hidden">
				<main class="flex-1 p-4 overflow-x-hidden overflow-y-auto">
					<div class="mx-auto">
						<slot></slot>
					</div>
				</main>
			</div>
		</div>
	</UtilsApp>
</template>

<script setup lang="ts"></script>
