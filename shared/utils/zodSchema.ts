import * as zod from "zod";

const defaultMessage = "Dit veld is verplicht";
const defaultEmailMessage = "Vul een geldig e-mailadres in";

const length8Field = "Moet minimaal 8 tekens lang zijn";

const loginFields = {
	email: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).email({ message: defaultEmailMessage }),
	password: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).min(8, { message: length8Field }),
};

const notificationField = {
	content: zod.string({ message: defaultMessage }),
	referentie: zod.string().optional(),
	email: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).email({ message: defaultEmailMessage }),
	onderwerp: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }),
};

const articleField = {
	content: zod.string({ message: defaultMessage }),
	topics: zod.array(zod.string()).min(1, { message: defaultMessage }),
	anchors: zod
		.array(
			zod.object({
				id: zod.string(),
				itemIndex: zod.number(),
				level: zod.number(),
				isActive: zod.boolean(),
				textContent: zod.string(),
			}),
		)
		.optional(),

	description: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }),
	title: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }),
	words: zod.number({ error: defaultMessage }).min(1, { message: defaultMessage }),
	connected_with_id: zod.preprocess(
		(value) => {
			if (value === "" || value === null || value === undefined) return null;
			if (typeof value === "string" && value.trim() !== "") return Number(value);
			return value;
		},
		zod.number({ error: defaultMessage }).nullable().optional(),
	),
};

const mulfiFactorField = {
	code: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).length(6, { message: "De code moet uit 6 cijfers bestaan" }),
};

const optionalString = zod.string().optional();

const navigatorField = {
	ip: zod.string(),
	screen: zod.string(),
	language: zod.string(),
};

const fileMetaField = {
	title: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).max(100, { message: "Mag niet langer zijn dan 100 tekens" }),
	alt: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).max(250, { message: "Mag niet langer zijn dan 250 tekens" }),
};

const subscriptionField = {
	endpoint: zod.string(),
	keys: zod.object({
		p256dh: zod.string(),
		auth: zod.string(),
	}),
};

const profileField = {
	title: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).max(100, { message: "Mag niet langer zijn dan 100 tekens" }),
	locatie: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).max(250, { message: "Mag niet langer zijn dan 250 tekens" }),
	subtitle: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).max(250, { message: "Mag niet langer zijn dan 250 tekens" }),
};

const tokenField = {
	name: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).max(100, { message: "Mag niet langer zijn dan 100 tekens" }),
	expires_at: zod.string().refine(
		(date) => {
			if (!date) return true;

			const parsedDate = new Date(date);
			const now = new Date();

			return parsedDate > now;
		},
		{ message: "De vervaldatum moet in de toekomst liggen" },
	),
};

const githubInstallationField = {
	installation_id: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).length(9, { message: "De installatie ID moet uit 9 cijfers bestaan" }),
	code: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).length(20, { message: "De code moet uit 20 tekens bestaan" }),
};

const topicField = {
	topics: zod.preprocess(
		(value) => {
			if (typeof value === "string")
				return value
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean);
			return value;
		},
		zod.array(zod.string().max(20, { message: "Mag niet langer zijn dan 20 tekens" }).min(2, { message: "Moet minimaal 2 tekens lang zijn" })),
	),
};

export const schema = {
	login: {
		state: {
			email: "",
			password: "",
		},
		rules: zod.object(loginFields),
	},

	notification: {
		state: {
			content: "",
			referentie: "",
			email: "",
			onderwerp: "",
		},
		rules: zod.object(notificationField),
	},

	article: {
		state: {
			content: "",
			topics: [],
			anchors: [],
			description: "",
			title: "",
			words: 0,
			connected_with_id: null,
		},

		rules: zod.object(articleField),
	},

	totp: {
		state: {
			code: "",
		},

		rules: zod.object(mulfiFactorField),
		optional: {
			state: {
				code: "",
			},
			rules: zod.object({
				code: optionalString,
			}),
		},
	},

	navigator: {
		state: {
			ip: "",
			screen: "",
			language: "",
		},
		rules: zod.object(navigatorField),
	},

	fileMeta: {
		state: {
			title: "",
			alt: "",
		},
		rules: zod.object(fileMetaField),
	},

	subscription: {
		state: {
			endpoint: "",
			keys: {
				p256dh: "",
				auth: "",
			},
		},
		rules: zod.object(subscriptionField),
	},

	profile: {
		state: {
			title: "",
			locatie: "",
			subtitle: "",
		},
		rules: zod.object(profileField),
	},

	token: {
		state: {
			name: "",
			expires_at: "",
		},
		rules: zod.object(tokenField),
	},

	installation: {
		state: {
			installation_id: "",
			code: "",
		},
		rules: zod.object(githubInstallationField),
	},

	topics: {
		state: {
			topics: [],
		},
		rules: zod.object(topicField),
	},
};

export type SchemaType = (typeof schema)[keyof typeof schema];

// export type BackendSchemaType = (typeof schema)[keyof typeof schema]["backend"];
