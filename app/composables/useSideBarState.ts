const isSidebarExpanded = ref(false);

export const useSideBarState = () => {
	const setExpanded = (value: boolean) => {
		isSidebarExpanded.value = value;
	};

	return {
		isSidebarExpanded,
		setExpanded,
	};
};
