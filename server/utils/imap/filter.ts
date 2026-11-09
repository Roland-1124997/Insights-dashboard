import type { ParsedMail } from "mailparser";

export type SpamAnalysis = {
	isSpam: boolean;
	score: number;
};

const SPAM_THRESHOLD = 50;
const ZERO_WIDTH_CHARACTERS = /[\u00ad\u061c\u115f\u1160\u17b4\u17b5\u180b-\u180f\u200b-\u200f\u202a-\u202e\u2060-\u2064\u2066-\u206f\u3164\ufeff]/g;
const DOMAIN_PATTERN = /\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi;

const normalizeText = (value: string) => value.normalize("NFKC").replace(ZERO_WIDTH_CHARACTERS, "").toLowerCase();

const getHeaderValue = (value: unknown): string => {
	if (typeof value === "string") return value;
	if (!Array.isArray(value)) return "";
	if (!value.every((item) => typeof item === "string")) return "";
	return value.join(", ");
};

const getHeaders = (mail: ParsedMail) => {
	const headers = Object.fromEntries(mail.headers.entries());

	const spam = getHeaderValue(headers["x-gem-spam-flag"]).trim().toLowerCase();
	const suspect = getHeaderValue(headers["x-rzg-expurgate"]).trim().toLowerCase();
	const antivirusStatus = getHeaderValue(headers["x-antivirus-status"]).trim().toLowerCase();

	return {
		spam: spam === "yes",
		suspect: suspect.includes("suspect"),
		unsafe: antivirusStatus !== "" && antivirusStatus !== "clean",
	};
};

const getDomain = (address: string) => address.toLowerCase().split("@").pop() || "";

const getEmailContent = (mail: ParsedMail) => {
	const subject = normalizeText(mail.subject ?? "");
	const body = normalizeText(`${mail.text ?? ""} ${mail.html ?? ""}`);

	const content = `${subject} ${body}`;

	const hasPaymentLanguage = /\b(factuur|betaling|betalingsherinnering|bankkaart|sepa|openstaand|vervallen|account|wachtwoord)\b/.test(content);

	return {
		content,
		hasPaymentLanguage,
	};
};

const getAdress = (mail: ParsedMail) => {
	const address = mail.from?.value?.[0]?.address ?? "";
	const name = mail.from?.value?.[0]?.name ?? "";

	const hasZeroWidth = name && ZERO_WIDTH_CHARACTERS.test(name);

	return {
		address,
		name,
		hasZeroWidth,
	};
};

const getFromDomain = (mail: ParsedMail, content: string) => {
	const { address } = getAdress(mail);

	const domain = getDomain(address);
	const mentioned = content.match(DOMAIN_PATTERN) ?? [];

	return domain && mentioned.some((mentiom) => mentiom !== domain && !mentiom.endsWith(`.${domain}`));
};

export const analyzeSpam = (mail: ParsedMail): SpamAnalysis => {
	let score = 0;

	const { spam, suspect, unsafe } = getHeaders(mail);
	if (spam || suspect || unsafe) score += 100;

	const { content, hasPaymentLanguage } = getEmailContent(mail);
	if (hasPaymentLanguage) score += 20;

	const unrelated = getFromDomain(mail, content);
	if (unrelated) score += 35;

	const { hasZeroWidth } = getAdress(mail);
	if (hasZeroWidth) score += 15;

	return { isSpam: score >= SPAM_THRESHOLD, score };
};
