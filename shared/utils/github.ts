import { mergeAttributes, Node } from "@tiptap/core";

export const githubView = Node.create({
	name: "nodeView",
	group: "block",
	atom: true,
	addAttributes() {
		return {
			private: {
				default: false,
			},
			html_url: {
				default: null,
			},
			home_page: {
				default: null,
			},
			topics: {
				default: [],
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: "github-view",
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ["github-view", mergeAttributes(HTMLAttributes)];
	},

	addNodeView() {
		return ({ node }) => {
			const dom = document.createElement("div");
			dom.className = "flex flex-wrap items-center gap-2";

			const details = { ...node.attrs };

			const icon = document.createElement("span");
			icon.className = "topic-icon";
			icon.setAttribute("aria-hidden", "true");
			icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from Akar Icons by Arturo Wibawa - https://github.com/artcoholic/akar-icons/blob/master/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 3L6 21M18 3l-4 18M4 8h17M3 16h17"/></svg>`;

			const github = document.createElement("span");
			github.className = "github-icon";
			github.setAttribute("aria-hidden", "true");
			github.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="text-blue-800"> <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2.01-.27c.68 0 1.36.09 2.01.27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>`;

			const website = document.createElement("span");
			website.className = "website-icon";
			website.setAttribute("aria-hidden", "true");
			website.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><!-- Icon from Akar Icons by Arturo Wibawa - https://github.com/artcoholic/akar-icons/blob/master/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 10.5L21 3m-5 0h5v5m0 6v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>`;

			function renderContent(attrs = details) {
				dom.innerHTML = "";

				const span = document.createElement("span");
				span.className = "px-3 py-2 text-xs font-bold text-blue-800 border border-blue-600 rounded-full hover:bg-blue-50 ";

				const innerSpan = document.createElement("span");
				innerSpan.className = "flex items-center justify-center gap-1 ";

				if (!attrs.private) {
					if (attrs.html_url) {
						const local = span.cloneNode(true);
						const innerLocal = innerSpan.cloneNode(true);

						innerLocal.appendChild(github.cloneNode(true));

						const link = document.createElement("a");
						link.href = attrs.html_url || "#";

						link.target = "_blank";
						link.rel = "noopener noreferrer";

						link.textContent = "Bekijk op GitHub";

						innerLocal.appendChild(link);

						local.appendChild(innerLocal);
						dom.appendChild(local);
					}

					if (attrs.home_page) {
						const local = span.cloneNode(true);
						const innerLocal = innerSpan.cloneNode(true);

						innerLocal.appendChild(website.cloneNode(true));

						const link = document.createElement("a");
						link.href = attrs.home_page || "#";

						link.target = "_blank";
						link.rel = "noopener noreferrer";

						link.textContent = "Website";

						innerLocal.appendChild(link);

						local.appendChild(innerLocal);
						dom.appendChild(local);
					}
				}

				const topicsSpan = document.createElement("span");
				topicsSpan.className = "px-3 py-2 text-xs font-bold text-blue-800 border border-blue-600 rounded-full";

				const topics = (Array.isArray(attrs.topics) ? attrs.topics : attrs.topics.split(",")) || [];

				if (attrs.topics != "")
					topics.forEach((topic: string) => {
						const local = topicsSpan.cloneNode(true);

						const innerLocal = innerSpan.cloneNode(true);
						innerLocal.appendChild(icon.cloneNode(true));
						innerLocal.appendChild(document.createTextNode(topic.toUpperCase()));

						local.appendChild(innerLocal);
						dom.appendChild(local);
					});
				else {
					const local = topicsSpan.cloneNode(true);
					const innerLocal = innerSpan.cloneNode(true);
					innerLocal.appendChild(icon.cloneNode(true));
					innerLocal.appendChild(document.createTextNode("Geen onderwerpen"));

					local.appendChild(innerLocal);
					dom.appendChild(local);
				}
			}

			renderContent();

			return {
				dom,
				update: (updatedNode) => {
					if (!updatedNode) return false;
					const newAttrs = updatedNode.attrs || {};

					details.topics = newAttrs.topics || [];
					details.private = !!newAttrs.private;
					details.html_url = newAttrs.html_url ?? null;
					details.home_page = newAttrs.home_page ?? null;
					renderContent(details);
					return true;
				},
			};
		};
	},
});
