<template>
	<div>
		<section class="relative grid grid-cols-1 gap-3 md:grid-cols-3">
			<article class="z-10 flex items-center w-full col-span-1 gap-2 p-2 border rounded-lg bg-gray-50 md:gap-3 md:p-3">
				<div class="flex items-center justify-center p-2 text-white bg-blue-600 rounded-lg shrink-0 md:p-3">
					<icon name="akar-icons:people-multiple" class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
				</div>
				<div class="flex-1 min-w-0">
					<h2 class="text-xs font-semibold text-gray-600 truncate md:text-sm">Gebruikersnaam</h2>
					<div class="flex items-center justify-between gap-2">
						<h3 class="text-base font-extrabold text-gray-900 truncate md:text-xl">
							{{ store?.user?.email }}
						</h3>
					</div>
				</div>
			</article>

			<article class="z-10 flex items-center w-full gap-2 p-2 border rounded-lg bg-gray-50 md:gap-3 md:p-3">
				<div class="flex items-center justify-center p-2 text-white bg-blue-600 rounded-lg shrink-0 md:p-3">
					<icon name="akar-icons:key" class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
				</div>
				<div class="flex-1 min-w-0">
					<h2 class="text-xs font-semibold text-gray-600 truncate md:text-sm">Passkey Authenticatie</h2>

					<div class="flex items-center justify-between gap-2">
						<button @click="registerPasskey" class="text-base font-extrabold text-gray-900 truncate md:text-xl">Maak een passkey aan</button>
					</div>
				</div>
			</article>

			<article class="z-10 flex items-center w-full gap-2 p-2 border rounded-lg bg-gray-50 md:gap-3 md:p-3">
				<div class="flex items-center justify-center p-2 text-white bg-blue-600 rounded-lg shrink-0 md:p-3">
					<icon name="akar-icons:shield" class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
				</div>
				<div class="flex-1 min-w-0">
					<h2 class="text-xs font-semibold text-gray-600 truncate md:text-sm">Tweefactorauthenticatie</h2>

					<div class="flex items-center justify-between gap-2">
						<button @click="account.disableProtection" v-if="store?.user?.factors?.enabled" class="text-base font-extrabold text-gray-900 truncate md:text-xl">Ingeschakeld</button>
						<button @click="account.enableProtection" v-else class="text-base font-extrabold text-gray-900 truncate md:text-xl">Uitgeschakeld</button>
					</div>
				</div>
			</article>
		</section>

		<UtilsAccountViewerSessions :sessions="account?.sessions || []" />

		<UtilsAccountViewerTokens :data="security.tokens?.values || []" />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - Account",
		description: "Bekijk en beheer je accountgegevens, beveiligingsinstellingen en actieve sessies.",
		ogTitle: "Insights - Account",
		ogDescription: "Bekijk en beheer je accountgegevens, beveiligingsinstellingen en actieve sessies.",
		ogUrl: "/profile",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Account",
		twitterDescription: "Bekijk en beheer je accountgegevens, beveiligingsinstellingen en actieve sessies.",
		twitterImage: "/icons/icon_512-blue.png",
		twitterCard: "summary_large_image",
	});

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
		link: [
			{
				rel: "icon",
				type: "image/png",
				href: "/icons/icon_512-blue.png",
			},
		],
	});

	const store = useSessions();
	const account = useAccount();
	const security = useSecurity();

	const uri: FetchUrl = "/api/auth/passkeys/register";
	const request = useApiHandler<ApiResponse<any>>(uri);

	const { addToast } = useToast();

	const registerPasskey = async () => {
		const { data, error } = await request.Get({
			extends: "/options",
		});

		if (!error && data) {
			const options = data.data.options;
			const challenge_id = data.data.challenge_id;

			try {
				const credential = await navigator.credentials.create({
					publicKey: {
						...options,

						challenge: useToBase64urlToUint8Array(options.challenge),

						user: {
							...options.user,
							id: useToBase64urlToUint8Array(options.user.id),
						},

						excludeCredentials: options.excludeCredentials?.map((credential: any) => ({
							...credential,
							id: useToBase64urlToUint8Array(credential.id),
						})),
					},
				});

				const { data, error } = await request.Post({
					extends: "/verify",
					body: { challenge_id, credential },
				});

				if (error)
					return addToast({
						type: "error",
						message: "Er is iets misgegaan bij het registreren van de passkey. Probeer het opnieuw.",
					});

				if (data) {
					addToast({
						type: "success",
						message: "Passkey succesvol geregistreerd!",
					});
				}
			} catch (err) {
				const error = err as DOMException;
				const name = error.name;

				if (name == "NotAllowedError")
					return addToast({
						type: "error",
						message: "Passkey registratie geannuleerd door de gebruiker.",
					});

				if (name == "InvalidStateError")
					return addToast({
						type: "error",
						message: "Op dit moment is er al een passkey geregistreerd voor dit apparaat. Verwijder de bestaande passkey voordat je een nieuwe registreert.",
					});

				addToast({
					type: "error",
					message: "Er is iets misgegaan bij het registreren van de passkey. Probeer het opnieuw.",
				});
			}
		}
	};
</script>
