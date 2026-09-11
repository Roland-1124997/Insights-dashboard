<template>
	<div class="grid gap-3 md:grid-cols-2">
		<div v-for="n in 1" :key="n" class="relative pt-5 bg-white border-t md:hidden md:border md:p-5 md:rounded-xl">
			<div class="animate-pulse">
				<div class="flex items-start justify-between mb-4">
					<div class="flex items-start gap-3">
						<div>
							<div class="flex items-center gap-2 mb-2">
								<div class="w-40 h-6 bg-gray-200 rounded-md"></div>
							</div>

							<div class="flex flex-wrap items-center gap-2">
								<div class="h-6 bg-gray-200 rounded-full w-28"></div>
								<div class="w-24 h-6 bg-gray-200 rounded-full"></div>
								<div class="w-20 h-6 bg-gray-200 rounded-full"></div>
							</div>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 md:grid-cols-2">
					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1 min-w-0">
							<div class="w-16 h-3 mb-2 bg-gray-200 rounded"></div>
							<div class="h-4 bg-gray-200 rounded w-28"></div>
						</div>
					</div>

					<div class="items-start hidden gap-3 md:flex">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1">
							<div class="w-20 h-3 mb-2 bg-gray-200 rounded"></div>
							<div class="w-32 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1 min-w-0">
							<div class="h-3 mb-2 bg-gray-200 rounded w-14"></div>
							<div class="w-24 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>

					<div class="flex items-start gap-3 md:hidden">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1 min-w-0">
							<div class="w-16 h-3 mb-2 bg-gray-200 rounded"></div>
							<div class="w-20 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>

					<div class="flex items-start gap-3 md:hidden">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1">
							<div class="w-20 h-3 mb-2 bg-gray-200 rounded"></div>
							<div class="w-32 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1">
							<div class="h-3 mb-2 bg-gray-200 rounded w-28"></div>
							<div class="w-32 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>

					<div class="items-start hidden gap-3 md:flex">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1 min-w-0">
							<div class="w-16 h-3 mb-2 bg-gray-200 rounded"></div>
							<div class="w-24 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>
				</div>

				<div class="flex flex-wrap items-center justify-between gap-2 pt-5 mt-4 border-t border-gray-200">
					<div class="flex items-center gap-1">
						<div class="w-3.5 h-3.5 bg-gray-200 rounded"></div>
						<div class="w-24 h-3 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		</div>

		<div v-for="n in 2" :key="n" class="relative hidden pt-5 bg-white border-t md:flex md:border md:p-5 md:rounded-xl">
			<div class="animate-pulse">
				<div class="flex items-start justify-between mb-4">
					<div class="flex items-start gap-3">
						<div>
							<div class="flex items-center gap-2 mb-2">
								<div class="w-40 h-6 bg-gray-200 rounded-md"></div>
							</div>

							<div class="flex flex-wrap items-center gap-2">
								<div class="h-6 bg-gray-200 rounded-full w-28"></div>
								<div class="w-24 h-6 bg-gray-200 rounded-full"></div>
								<div class="w-20 h-6 bg-gray-200 rounded-full"></div>
							</div>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 md:grid-cols-2">
					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1 min-w-0">
							<div class="w-16 h-3 mb-2 bg-gray-200 rounded"></div>
							<div class="h-4 bg-gray-200 rounded w-28"></div>
						</div>
					</div>

					<div class="items-start hidden gap-3 md:flex">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1">
							<div class="w-20 h-3 mb-2 bg-gray-200 rounded"></div>
							<div class="w-32 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1 min-w-0">
							<div class="h-3 mb-2 bg-gray-200 rounded w-14"></div>
							<div class="w-24 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>

					<div class="flex items-start gap-3 md:hidden">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1 min-w-0">
							<div class="w-16 h-3 mb-2 bg-gray-200 rounded"></div>
							<div class="w-20 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>

					<div class="flex items-start gap-3 md:hidden">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1">
							<div class="w-20 h-3 mb-2 bg-gray-200 rounded"></div>
							<div class="w-32 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>

					<div class="flex items-start gap-3">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1">
							<div class="h-3 mb-2 bg-gray-200 rounded w-28"></div>
							<div class="w-32 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>

					<div class="items-start hidden gap-3 md:flex">
						<div class="w-8 h-8 bg-gray-200 rounded-lg shrink-0"></div>

						<div class="flex-1 min-w-0">
							<div class="w-16 h-3 mb-2 bg-gray-200 rounded"></div>
							<div class="w-24 h-4 bg-gray-200 rounded"></div>
						</div>
					</div>
				</div>

				<div class="flex flex-wrap items-center justify-between gap-2 pt-5 mt-4 border-t border-gray-200">
					<div class="flex items-center gap-1">
						<div class="w-3.5 h-3.5 bg-gray-200 rounded"></div>
						<div class="w-24 h-3 bg-gray-200 rounded"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
