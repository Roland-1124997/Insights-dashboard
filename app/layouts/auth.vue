<template>
	<UtilsApp :disablePwaPrompt="true">
		<UtilsDotPattern class="opacity-60" :width="20" :height="20" :cx="1" :cy="1" :cr="1" />

		<main class="z-10 flex flex-col w-full px-6 md:justify-center sm:px-12 md:items-center md:w-full md:px-6">
			<div class="w-full max-w-md mx-auto md:max-w-xl md:p-10 md:bg-white md:rounded-2xl md:shadow-xl md:ring-1 md:ring-gray-200/80">
				<header class="mt-12 mb-8 md:mb-4 lg:mt-2">
					<div class="flex items-center space-x-3">
						<div class="flex items-center justify-center w-10 h-10 overflow-hidden bg-blue-600 rounded-xl">
							<img src="\svgs\icon_512-blue.svg" alt="Insights Logo" draggable="false" class="w-10 h-10 rounded-lg" />
						</div>
						<p class="text-2xl font-bold text-blue-950">Insights</p>
					</div>
				</header>

				<div class="hidden mb-5 md:block">
					<UtilsScales />
				</div>

				<slot></slot>
			</div>
		</main>
	</UtilsApp>
</template>
