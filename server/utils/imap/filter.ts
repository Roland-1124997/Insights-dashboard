import type { ParsedMail } from "mailparser";

export type SpamAnalysis = {
	isSpam: boolean;
	score: number;
};

const SPAM_THRESHOLD = 50;
const ZERO_WIDTH_CHARACTERS =
	/(?:\u{00ad}|\u{061c}|\u{115f}|\u{1160}|\u{17b4}|\u{17b5}|\u{180b}|\u{180c}|\u{180d}|\u{180e}|\u{180f}|\u{200b}|\u{200c}|\u{200d}|\u{200e}|\u{200f}|\u{202a}|\u{202b}|\u{202c}|\u{202d}|\u{202e}|\u{2060}|\u{2061}|\u{2062}|\u{2063}|\u{2064}|\u{2066}|\u{2067}|\u{2068}|\u{2069}|\u{206a}|\u{206b}|\u{206c}|\u{206d}|\u{206e}|\u{206f}|\u{3164}|\u{feff})/gu;
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
