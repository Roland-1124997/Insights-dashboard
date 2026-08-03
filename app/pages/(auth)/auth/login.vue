<template>
	<div class="relative">
		<div class="relative w-full max-w-lg mx-auto">
			<div class="space-y-2">
				<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Krijg toegang tot je account</h1>
				<p class="text-sm text-gray-600 md:text-base">Vul hieronder je e-mailadres en wachtwoord in om toegang te krijgen tot je account.</p>
			</div>

			<FormBase :schema="schema.login.frontend" :request v-slot="{ loading }" class="mt-10">
				<UtilsInput name="email" label="E-mailadres" icon-name="akar-icons:envelope" type="email" placeholder="you@company.com" :required="true" :disabled="loading" />

				<UtilsInput name="password" label="Wachtwoord" icon-name="akar-icons:lock-on" type="password" placeholder="••••••••" :disabled="loading" :required="true" />

				<div class="fixed bottom-0 left-0 flex items-center w-full gap-2 px-6 pt-6 pb-10 bg-white border-t md:relative md:px-0 md:bg-transparent md:border-0 md:py-0">
					<button
						type="submit"
						:disabled="loading"
						class="relative inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
						<span v-if="!loading" class="inline-flex items-center gap-2">
							<Icon name="akar-icons:circle-chevron-right-fill" />
							Inloggen
						</span>
						<span v-else class="inline-flex items-center gap-2">
							<Icon name="akar-icons:arrow-cycle" class="animate-spin" />
							Bezig met inloggen…
						</span>
					</button>

					<button
						@click.prevent="loginWithPasskey"
						class="inline-flex items-center justify-center gap-2 px-4 py-[0.80rem] text-gray-700 transition bg-gray-100 w-fit hover:bg-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:opacity-60">
						<icon name="akar-icons:key" size="1.4rem" />
						<span class="sr-only">Inloggen met Passkey</span>
					</button>
				</div>
			</FormBase>
		</div>
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights",
		description: "Welkom terug! Log in om door te gaan naar je dashboard.",
		ogTitle: "Insights",
		ogDescription: "Welkom terug! Log in om door te gaan naar je dashboard.",
		ogUrl: "/",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights",
		twitterDescription: "Welkom terug! Log in om door te gaan naar je dashboard.",
		twitterImage: "/icons/icon_512-blue.png",
		twitterCard: "app",
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

	const create = async () => {
		const ipRequest = useApiHandler<{ ip: string }>("https://api.ipify.org?format=json");

		const { data, error } = await ipRequest.Get();
		if (error || !data) return;

		const {
			screen: { width, height },
			navigator: { language },
		} = window;

		const request = useApiHandler("/api/auth/account/sessions");

		request.Post({
			body: {
				screen: `${width}x${height}`,
				language,
				ip: data.ip,
			},
		});
	};

	const request: requestOptions = {
		url: "/api/auth",
		method: "POST",
		successMessage: "Je bent succesvol ingelogd! en wordt doorgestuurd...",
		onsuccess: async () => await create(),
	};

	const uri: FetchUrl = "/api/auth/passkeys/login";
	const Request = useApiHandler<ApiResponse<any>>(uri);

	const { addToast } = useToast();

	const loginWithPasskey = async () => {
		const { data, error } = await Request.Get({
			extends: "/options",
		});

		if (!error && data) {
			const options = data.data.options;
			const challenge_id = data.data.challenge_id;

			try {
				const credential = await navigator.credentials.get({
					publicKey: {
						...options,
						challenge: useToBase64urlToUint8Array(options.challenge),
					},
				});

				const { data, error } = await Request.Post({
					extends: "/verify",
					body: { challenge_id, credential },
				});

				if (error)
					return addToast({
						type: "error",
						message: "Er is iets misgegaan bij het inloggen met de passkey. Probeer het opnieuw.",
					});

				if (data) {
					const status = data.status;
					const redirect = status.redirect;

					addToast({
						type: "success",
						message: "Je bent succesvol ingelogd! en wordt doorgestuurd...",
					});

					if (redirect) await navigateTo(redirect);
					await create();
				}
			} catch (err) {
				const error = err as DOMException;
				const name = error.name;

				if (name == "NotAllowedError")
					return addToast({
						type: "error",
						message: "Inloggen met passkey is geannuleerd. Probeer het opnieuw.",
					});

				addToast({
					type: "error",
					message: "Er is iets misgegaan bij het inloggen met de passkey. Probeer het opnieuw.",
				});
			}
		}
	};
</script>
