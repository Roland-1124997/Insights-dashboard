import { mergeAttributes, Node } from "@tiptap/core";

export const topicsView = Node.create({
	name: "topicsView",
	group: "block",
	atom: true,
	addAttributes() {
		return {
			topics: {
				default: [],
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: "topics-view",
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ["topics-view", mergeAttributes(HTMLAttributes)];
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

			function renderContent(attrs = details) {
				dom.innerHTML = "";

				const topics = (Array.isArray(attrs.topics) ? attrs.topics : attrs.topics.split(",")) || [];

				const span = document.createElement("span");
				span.className = "px-3 py-2 text-xs font-bold text-blue-800 border border-blue-600 rounded-full";

				const innerSpan = document.createElement("span");
				innerSpan.className = "flex items-center justify-center gap-1 ";

				topics.forEach((topic: string) => {
					const local = span.cloneNode(true);

					const innerLocal = innerSpan.cloneNode(true);
					innerLocal.appendChild(icon.cloneNode(true));
					innerLocal.appendChild(document.createTextNode(topic.toUpperCase()));

					local.appendChild(innerLocal);
					dom.appendChild(local);
				});
			}

			renderContent();

			return {
				dom,
				update: (updatedNode) => {
					if (!updatedNode) return false;
					const newAttrs = updatedNode.attrs || {};

					details.topics = newAttrs.topics || [];
					renderContent(details);
					return true;
				},
			};
		};
	},
});
