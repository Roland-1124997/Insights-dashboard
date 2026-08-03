export const useToBase64urlToUint8Array = (base64url: string) => {
	const padding = "=".repeat((4 - (base64url.length % 4)) % 4);

	const base64 = (base64url + padding).replace(/-/g, "+").replace(/_/g, "/");

	const binary = atob(base64);

	return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};
