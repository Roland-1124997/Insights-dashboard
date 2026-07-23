export const useCountryName = (countryCode: string | null, lang: string = "nl") => {
	if (!countryCode) return "Onbekend";
	try {
		const regionNames = new Intl.DisplayNames([lang], { type: "region" });
		return regionNames.of(countryCode) || "Onbekend";
	} catch (error) {
		return "Onbekend";
	}
};
