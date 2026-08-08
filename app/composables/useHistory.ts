export const useHistory = () => {
	const history = useLocalStorage<RouteHistory>("history", {});

	const clearHistory = (path: string) => {
		history.value[path] = [];
	};

	const getHistory = (path: string): HistoryEntry[] => history.value[path] || [];
	const getHistoryLastEntry = (path: string): HistoryEntry | null => getHistory(path)[0] || null;
	const setHistory = (path: string, entries: HistoryEntry[]) => {
		history.value[path] = entries;
	};

	return {
		clear: clearHistory,
		get: getHistory,
		LastEntry: getHistoryLastEntry,
		set: setHistory,
	};
};
