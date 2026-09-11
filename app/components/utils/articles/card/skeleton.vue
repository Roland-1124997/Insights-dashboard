<template>
	<div v-for="n in 2" :key="n" class="relative z-10 flex flex-col h-full overflow-hidden bg-white border shadow-sm md:hidden rounded-2xl border-slate-200 animate-pulse">
		<div class="flex flex-col flex-1 p-5">
			<div class="flex items-start justify-between gap-4">
				<div class="flex-1 min-w-0">
					<div class="mb-2">
						<div class="w-24 h-5 rounded-full bg-slate-200"></div>
					</div>
					<div class="mt-6 space-y-2">
						<div class="w-4/5 h-6 rounded bg-slate-200"></div>
						<div class="w-3/5 h-6 rounded bg-slate-200"></div>
					</div>
				</div>
				<div class="flex shrink-0 items-center gap-1.5">
					<div class="w-8 h-8 rounded-lg bg-slate-200"></div>
					<div class="w-8 h-8 rounded-lg bg-slate-200"></div>
					<div class="w-8 h-8 rounded-lg bg-slate-200"></div>
				</div>
			</div>
			<div class="h-px my-4 bg-slate-200"></div>
			<div class="space-y-2">
				<div class="w-full h-4 rounded bg-slate-200"></div>
				<div class="w-full h-4 rounded bg-slate-200"></div>
				<div class="w-2/3 h-4 rounded bg-slate-200"></div>
			</div>
			<div class="mt-4 flex min-h-7 flex-wrap gap-1.5">
				<div class="w-16 h-6 rounded-full bg-slate-200"></div>
				<div class="w-20 h-6 rounded-full bg-slate-200"></div>
				<div class="h-6 rounded-full w-14 bg-slate-200"></div>
			</div>
			<div class="mt-auto pt-9">
				<div class="flex flex-wrap items-center pt-4 border-t gap-x-4 gap-y-2 border-slate-100">
					<div class="w-20 h-4 rounded bg-slate-200"></div>
					<div class="w-20 h-4 rounded bg-slate-200"></div>
					<div class="w-20 h-4 rounded bg-slate-200"></div>
				</div>
			</div>
		</div>
	</div>
	<div v-for="n in 6" :key="n" class="relative z-10 flex-col hidden h-full overflow-hidden bg-white border shadow-sm md:flex rounded-2xl border-slate-200 animate-pulse">
		<div class="flex flex-col flex-1 p-5">
			<div class="flex items-start justify-between gap-4">
				<div class="flex-1 min-w-0">
					<div class="mb-2">
						<div class="w-24 h-5 rounded-full bg-slate-200"></div>
					</div>
					<div class="mt-6 space-y-2">
						<div class="w-4/5 h-6 rounded bg-slate-200"></div>
						<div class="w-3/5 h-6 rounded bg-slate-200"></div>
					</div>
				</div>
				<div class="flex shrink-0 items-center gap-1.5">
					<div class="w-8 h-8 rounded-lg bg-slate-200"></div>
					<div class="w-8 h-8 rounded-lg bg-slate-200"></div>
					<div class="w-8 h-8 rounded-lg bg-slate-200"></div>
				</div>
			</div>
			<div class="h-px my-4 bg-slate-200"></div>
			<div class="space-y-2">
				<div class="w-full h-4 rounded bg-slate-200"></div>
				<div class="w-full h-4 rounded bg-slate-200"></div>
				<div class="w-2/3 h-4 rounded bg-slate-200"></div>
			</div>
			<div class="mt-4 flex min-h-7 flex-wrap gap-1.5">
				<div class="w-16 h-6 rounded-full bg-slate-200"></div>
				<div class="w-20 h-6 rounded-full bg-slate-200"></div>
				<div class="h-6 rounded-full w-14 bg-slate-200"></div>
			</div>
			<div class="mt-auto pt-9">
				<div class="flex flex-wrap items-center pt-4 border-t gap-x-4 gap-y-2 border-slate-100">
					<div class="w-24 h-4 rounded bg-slate-200"></div>
					<div class="w-20 h-4 rounded bg-slate-200"></div>
					<div class="h-4 rounded w-28 bg-slate-200"></div>
				</div>
			</div>
		</div>
	</div>
</template>
