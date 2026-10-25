<template>
	<aside
		:class="[
			'fixed inset-y-0 left-0 z-[60] w-52 overflow-hidden bg-gray-50 border-r transform transition-transform duration-300 ease-in-out lg:transition-[width] lg:duration-500 lg:ease-in-out lg:translate-x-0 h-full lg:static lg:inset-0',
			isSidebarExpanded ? 'lg:w-52' : 'lg:w-16',
			isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
			installed ? 'pt-[2.5rem] md:pt-0' : '',
		]">
		<div class="flex flex-col h-full select-none" @mouseenter="startSidebarHover" @mouseleave="stopSidebarHover">
			<div class="flex items-center justify-between h-16 px-4 border-b">
				<div class="flex items-center space-x-3">
					<div class="flex items-center justify-center flex-shrink-0 w-8 h-8 overflow-hidden bg-blue-600 rounded-lg">
						<img src="\svgs\icon_512-blue.svg" alt="Insights Logo" draggable="false" class="rounded-lg w-7 h-7" />
					</div>
					<h1 :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'" class="text-xl font-bold transition-opacity duration-300 text-blue-950">Insights</h1>
				</div>

				<button aria-label="sluit sidebar menu" @click="isMobileMenuOpen = false" class="flex items-center justify-center p-2 rounded-lg lg:hidden hover:bg-gray-100">
					<Icon name="akar-icons:x-small" size="1.6rem" />
					<span class="sr-only">Sluit menu</span>
				</button>
			</div>

			<nav id="sidebar-menu" aria-label="Hoofdnavigatie" class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
				<ClientOnly>
					<NuxtLink
						v-for="(route, to) in routes"
						v-show="!route.hidden"
						:key="to"
						:to="constructRoute(to, route)"
						:class="routerActiveRelatedClass(route, to)"
						class="relative flex items-center gap-3 px-3 py-2 text-gray-700 transition-colors rounded-lg hover:bg-blue-100 hover:text-blue-800"
						:aria-label="route.label"
						@click="clickAction(route)">
						<Icon :name="route.iconName" class="flex-shrink-0 w-5 h-5" />
						<span :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'" class="flex-1 transition-opacity duration-300">{{ route.label }}</span>
						<span
							v-if="route.alert && Number(useAlertCount(route.toolbar?.store)) > 0"
							:class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'"
							class="inline-flex items-center justify-center flex-shrink-0 p-1 text-xs font-bold leading-none text-white transition-opacity duration-500 ease-in-out bg-red-600 rounded-full min-h-5 min-w-5 h-fit w-fit">
							{{ useAlertCount(route.toolbar?.store, true) }}
						</span>
						<span
							v-if="route.alert && Number(useAlertCount(route.toolbar?.store)) > 0"
							:class="isSidebarExpanded ? 'opacity-0' : 'opacity-100'"
							class="absolute inline-flex items-center justify-center flex-shrink-0 p-1 text-xs font-bold leading-none text-white transition-opacity duration-500 ease-in-out bg-red-600 rounded-full left-7 -top-1 min-h-5 min-w-5 h-fit w-fit">
							{{ useAlertCount(route.toolbar?.store, true) }}
						</span>
					</NuxtLink>

					<template #fallback>
						<NuxtLink
							v-for="(route, to) in routes"
							v-show="!route.hidden"
							:key="to"
							:to="to"
							:class="routerActiveRelatedClass(route, to)"
							class="relative flex items-center gap-3 px-3 py-2 text-gray-700 transition-colors rounded-lg hover:bg-blue-100 hover:text-blue-800"
							:aria-label="route.label"
							@click="clickAction(route)">
							<Icon :name="route.iconName" class="flex-shrink-0 w-5 h-5" />
							<span :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'" class="flex-1 transition-opacity duration-300">{{ route.label }}</span>
							<span
								v-if="route.alert && Number(useAlertCount(route.toolbar?.store)) > 0"
								:class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'"
								class="inline-flex items-center justify-center flex-shrink-0 p-1 text-xs font-bold leading-none text-white transition-opacity duration-500 ease-in-out bg-red-600 rounded-full min-h-5 min-w-5 h-fit w-fit">
								{{ useAlertCount(route.toolbar?.store, true) }}
							</span>
							<span
								v-if="route.alert && Number(useAlertCount(route.toolbar?.store)) > 0"
								:class="isSidebarExpanded ? 'opacity-0' : 'opacity-100'"
								class="absolute inline-flex items-center justify-center flex-shrink-0 p-1 text-xs font-bold leading-none text-white transition-opacity duration-500 ease-in-out bg-red-600 rounded-full left-7 -top-1 min-h-5 min-w-5 h-fit w-fit">
								{{ useAlertCount(route.toolbar?.store, true) }}
							</span>
						</NuxtLink>
					</template>
				</ClientOnly>
			</nav>

			<div v-if="Object.keys(routes).length > 0" class="p-3 mb-3 border-t md:mb-0">
				<button aria-label="uitlogen" @click="store.logout" class="flex items-center w-full gap-3 px-3 py-2 text-gray-700 transition-colors rounded-lg hover:bg-red-50 hover:text-red-600">
					<Icon name="akar-icons:door" class="flex-shrink-0 w-5 h-5" />
					<span :class="isSidebarExpanded ? 'opacity-100' : 'opacity-0'" class="transition-opacity duration-300">Uitloggen</span>
				</button>
			</div>
		</div>
	</aside>

	<div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"></div>
</template>

<script setup lang="ts">
	const store = useSessions();
	const route = useRoute();

	const { installed } = useCheckPwa();

	const { LastEntry } = useHistory();

	const { setExpanded } = useSideBarState();

	const isMobileMenuOpen = defineModel<boolean>("isMobileMenuOpen");
	const { routes } = defineProps<{ routes: Record<string, RouteType> }>();

	const isSidebarHovered = ref(false);
	let sidebarHoverTimeout: ReturnType<typeof setTimeout> | undefined;
	const isSidebarExpanded = computed(() => isMobileMenuOpen.value || isSidebarHovered.value);

	watch(isSidebarExpanded, (newValue) => {
		setExpanded(newValue);
	});

	const startSidebarHover = () => {
		if (sidebarHoverTimeout) clearTimeout(sidebarHoverTimeout);
		sidebarHoverTimeout = setTimeout(() => {
			isSidebarHovered.value = true;
		}, 3000);
	};

	const stopSidebarHover = () => {
		if (sidebarHoverTimeout) {
			clearTimeout(sidebarHoverTimeout);
			sidebarHoverTimeout = undefined;
		}
		isSidebarHovered.value = false;
	};

	onUnmounted(stopSidebarHover);

	const clickAction = (route: RouteType) => {
		isMobileMenuOpen.value = false;
		if (route.refetchOnEnter) useRefreshCurrentStore(route.toolbar?.store);
	};

	const routerActiveRelatedClass = (config: RouteType, to: string) => {
		const path = route.path.replace("/", "");
		const target = to.replace("/", "");

		const className = "router-link-related-active";
		const isRelated = (to !== "/" && path.startsWith(target)) || config.related?.includes(route.path);

		return isRelated ? className : "";
	};

	const constructRoute = (to: string, Route: RouteType) => {
		const lastEntry = LastEntry(to);

		const params = new URLSearchParams();

		if (lastEntry?.filter && lastEntry.filter != Route.toolbar?.fallbackFilter) params.set("filter", (route.query.filter as string) || lastEntry.filter);
		if (lastEntry?.search) params.set("search", lastEntry.search);
		if (lastEntry?.page && Number(lastEntry.page) > 1) params.set("page", String(lastEntry.page));

		const queryString = params.toString();

		return queryString ? `${to}?${queryString}` : to;
	};
</script>

<style scoped>
	.router-link-related-active {
		@apply text-blue-800 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200;
	}

	.router-link-active {
		@apply text-blue-800 bg-blue-100 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300;
	}
</style>
