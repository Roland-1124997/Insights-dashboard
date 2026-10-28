<template>
	<div class="">
		<div class="">
			<div v-if="editor">
				<div :class="isSidebarExpanded ? 'xl:grid-cols-[1fr_2fr]' : 'xl:grid-cols-[1.8fr_1.2fr]'" class="grid h-full grid-cols-1">
					<div :class="isSidebarExpanded ? 'md:px-4' : 'md:px-10 md:mr-1'" class="z-10 p-2 rounded-lg bg-gray-50 md:p-0 md:border-r">
						<div class="relative flex flex-col mt-1 outline-none appearance-none md:mt-auto h-[75vh] sm:h-[85vh] md:h-[88vh]">
							<div class="sticky top-0 z-20 flex items-center justify-end gap-2 pb-1 bg-gray-50 md:justify-start md:pb-0 md:mt-3">
								<TiptapMenu v-if="!loaded" class="items-center hidden p-1 py-1 mb-1 overflow-x-auto underline bg-white border rounded-lg md:flex" :editor="editor" :editable v-model="connectionId" />

								<template class="inline md:hidden">
									<TiptapMenuColor v-model="openOptions" :options />
								</template>

								<FormBase :appendToBody :request :schema="schema.article.frontend" v-slot="{ loading, errors, meta }">
									<div v-if="!loaded" class="flex gap-2 -mt-[0.15rem]">
										<p v-if="Object.keys(errors).length" class="flex items-center w-full gap-1 p-2 text-blue-600 border border-blue-600 rounded-md select-none">
											<Icon name="akar-icons:triangle-alert-fill" class="w-4 h-4 text-blue-600" aria-hidden="true" />
											<span class="sr-only">Er zijn {{ Object.keys(errors).length }} fout(en) in het formulier.</span>
										</p>

										<button
											@click.prevent="toggleEditable"
											class="flex items-center justify-center w-full gap-2 p-2 text-white bg-blue-600 border-blue-500 rounded-md outline-none cursor-pointer select-none hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
											<icon :name="!editable ? 'akar-icons:edit' : 'akar-icons:eye'" class="w-4 h-4" aria-hidden="true" />
											<span class="sr-only">{{ !editable ? "Bewerken" : "Voorbeeld" }}</span>
										</button>

										<button
											v-if="Object.keys(errors).length < 1"
											class="flex items-center justify-center w-full gap-2 p-2 text-white bg-blue-600 border-blue-500 rounded-md outline-none select-none hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
											<icon name="akar-icons:save" class="w-4 h-4" aria-hidden="true" />
											<span class="sr-only">{{ editId ? "Bijwerken" : "Aanmaken" }}</span>
										</button>

										<template class="flex gap-2 md:hidden">
											<button @click.prevent="toggleOptions" class="flex items-center w-full gap-1 p-2 text-blue-600 border border-blue-600 rounded-md select-none">
												<icon name="fluent:highlight-24-regular" class="w-4 h-4" aria-hidden="true" />
												<span class="sr-only"> Highlight </span>
											</button>

											<button @click.prevent="editor?.commands.undo()" class="flex items-center w-full gap-1 p-2 text-blue-600 border border-blue-600 rounded-md select-none">
												<icon name="akar-icons:arrow-back" class="w-4 h-4" aria-hidden="true" />
												<span class="sr-only"> undo </span>
											</button>

											<button @click.prevent="editor?.commands.redo()" class="flex items-center w-full gap-1 p-2 text-blue-600 border border-blue-600 rounded-md select-none">
												<icon name="akar-icons:arrow-forward" class="w-4 h-4" aria-hidden="true" />
												<span class="sr-only"> redo </span>
											</button>
										</template>

										<template class="flex xl:hidden">
											<button @click.prevent="toggleTableOfContents" class="flex items-center w-full gap-1 p-2 text-blue-600 border border-blue-600 rounded-md select-none">
												<icon name="akar-icons:text-align-justified" class="w-4 h-4" aria-hidden="true" />
												<span class="sr-only"> Inhoudsopgave </span>
											</button>
										</template>
									</div>

									<div class="sr-only" aria-hidden>
										<UtilsInput name="connected_with_id" :initial-value="connectionId" type="number" />
										<UtilsInput name="title" :initial-value="title" />
										<UtilsInput name="description" :initial-value="description" />
										<UtilsInput name="words" :initial-value="words" type="number" />
										<UtilsInput name="topics" :initial-value="topics" type="array" />
									</div>
								</FormBase>
							</div>

							<div ref="tiptap-container" class="relative flex-1 w-full min-h-0 p-2 overflow-x-hidden overflow-y-auto md:pl-10 md:-ml-10 md:py-10">
								<FloatingMenu :editor="editor" class="absolute !right-0 !left-auto z-40 flex items-center justify-end max-w-[9.5rem] overflow-x-auto md:hidden">
									<TiptapMenu
										:hidden
										v-if="!loaded"
										class="flex items-center min-w-full p-1 py-1 mb-1 overflow-x-auto underline bg-white border rounded-lg w-max"
										:editor="editor"
										:editable
										v-model="connectionId" />
								</FloatingMenu>

								<drag-handle v-if="editor" :editor="editor" :compute-position-config="{ placement: 'left-start', strategy: 'absolute' }">
									<div class="custom-drag-handle">
										<icon name="fluent:re-order-dots-20-filled" class="w-4 h-4" aria-hidden="true" />
										<span class="sr-only">Sleep om te herordenen</span>
									</div>
								</drag-handle>

								<TiptapEditor v-if="!loaded" :editor="editor" aria-label="Artkel inhoud" />
							</div>
						</div>
					</div>
					<div
						v-if="!loaded"
						:class="openTableOfContents ? 'translate-x-0' : 'translate-x-full pointer-events-none'"
						class="fixed inset-y-0 right-0 z-[71] w-full overflow-y-auto transition-transform duration-300 ease-in-out bg-white shadow-xl md:w-[24rem] xl:relative xl:inset-auto xl:z-auto xl:block xl:w-auto xl:max-w-none xl:translate-x-0 xl:overflow-x-hidden xl:overflow-y-auto xl:bg-transparent xl:shadow-none xl:pointer-events-auto h-full xl:h-[86vh]">
						<div :class="installed ? ' mt-[4rem] md:mt-[1rem] xl:mt-0' : ''" class="flex items-center justify-between h-16 px-4 border-b xl:hidden">
							<div class="flex items-center space-x-3">
								<div class="flex items-center justify-center flex-shrink-0 w-8 h-8 overflow-hidden bg-blue-600 rounded-lg">
									<img src="\svgs\icon_512-blue.svg" alt="Insights Logo" draggable="false" class="rounded-lg w-7 h-7" />
								</div>
								<h1 class="text-xl font-bold transition-opacity duration-300 text-blue-950">Inhoudsopgave</h1>
							</div>

							<button aria-label="sluit sidebar menu" @click="closeTableOfContents" class="flex items-center justify-center p-2 rounded-lg xl:hidden hover:bg-gray-100">
								<Icon name="akar-icons:x-small" size="1.6rem" />
								<span class="sr-only">Sluit menu</span>
							</button>
						</div>

						<TiptapTableList :Anchors="Anchors" v-model="activeId" @update:model-value="closeTableOfContents" />
					</div>
					<div v-if="openTableOfContents" class="fixed inset-0 select-none z-[70] bg-black/50 xl:hidden" aria-hidden="true" @click="closeTableOfContents"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { getHierarchicalIndexes, TableOfContents } from "@tiptap/extension-table-of-contents";
	import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
	import { all, createLowlight } from "lowlight";
	import { DragHandle } from "@tiptap/extension-drag-handle-vue-3";
	import { NodeRange } from "@tiptap/extension-node-range";
	import { FloatingMenu } from "@tiptap/vue-3/menus";

	useSeoMeta({
		title: "Insights - Artikel Opstellen",
		description: "Schrijf een nieuw artikel of blog post voor je website.",
		ogTitle: "Insights - Artikel Opstellen",
		ogDescription: "Schrijf een nieuw artikel of blog post voor je website.",
		ogUrl: "/artikelen/opstellen",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Artikel Opstellen",
		twitterDescription: "Schrijf een nieuw artikel of blog post voor je website.",
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

	const { installed } = useCheckPwa();

	const openTableOfContents = ref(false);

	const toggleTableOfContents = () => {
		openTableOfContents.value = !openTableOfContents.value;
	};

	const closeTableOfContents = () => {
		openTableOfContents.value = false;
	};

	const hidden = ["Highlights", "Code Block", "Details", "Metadata", "Redo", "Undo", "Bullet List"];

	const { addToast } = useToast();
	const { isSidebarExpanded } = useSideBarState();

	const store = useArticles();
	const storage = useStorage();

	const content = ref<{
		type: string;
		content: any[];
	} | null>(null);

	const connectionId = ref();
	const activeId = ref<null | string>(null);
	const editable = ref(true);

	const editId = computed(() => {
		const route = useRoute();
		return route.query.edit as string | undefined;
	});

	const loaded = ref(true);

	const container = useTemplateRef("tiptap-container");

	onMounted(async () => {
		setTimeout(() => {
			const images = container.value?.querySelectorAll<HTMLImageElement>("img") || [];

			for (const image of images) {
				if (image.src.endsWith("/github.jpg")) continue;

				if (image.complete && image.naturalWidth === 0) {
					image.src = "/github.jpg";
					continue;
				}

				image.addEventListener(
					"error",
					() => {
						if (image.src.endsWith("/github.jpg")) return;
						image.src = "/github.jpg";
					},
					{ once: true },
				);
			}
		}, 100);

		if (!editId.value) await new Promise((resolve) => setTimeout(resolve, 100));
		loaded.value = false;
	});

	const payload = store.getSavedPayload();

	if (editId.value) {
		if (payload) {
			content.value = payload.content;
			connectionId.value = payload.connected_with_id;
		} else {
			const payload = store.articles?.find((article) => article.id === editId.value);

			if (payload) {
				content.value = payload.content;
				connectionId.value = payload.connected_with_id;
			}
		}
	} else {
		content.value = payload?.content;
		connectionId.value = payload?.connected_with_id;
	}

	const title = ref("");
	const description = ref("");
	const Anchors = ref<Anchor[]>([]);
	const words = ref(0);
	const topics = ref<string[]>([]);

	const populateUniqueAnchors = (uniqueAnchors: Anchor[], seenAnchorIds: Set<string>, anchor: Anchor) => {
		if (seenAnchorIds.has(anchor.id)) return;

		uniqueAnchors.push({
			id: anchor.id,
			level: anchor.level,
			isActive: anchor.isActive,
			itemIndex: anchor.itemIndex,
			textContent: anchor.textContent,
		});

		seenAnchorIds.add(anchor.id);
	};

	const populateFields = (editor: Editor) => {
		content.value = editor.getJSON();
		store.savePayload({
			connected_with_id: connectionId.value,
			content: content.value,
		});

		words.value = editor.storage.characterCount.words();
		title.value = editor.$doc.firstChild?.textContent || "Ongetiteld Artikel";

		const item = content.value?.content.filter((node) => node.type === "nodeView")[0];

		const stored = (Array.isArray(item?.attrs.topics) ? item?.attrs.topics : item?.attrs.topics.split(",")) || [];

		if (stored.every((item: string) => item === "")) topics.value = ["geen onderwerp"];
		else topics.value = stored;

		const { filtered } = useFilterParagraphs(content.value?.content, "paragraph");
		description.value = filtered.value[0] ? filtered.value[0].content[0]?.text : "";
	};

	const populateAnchors = (anchors: Anchor[]) => {
		const uniqueAnchors: Anchor[] = [];
		const seenAnchorIds = new Set<string>();

		activeId.value = anchors.filter((anchor) => anchor.isActive)[0]?.id || null;

		anchors.forEach((anchor) => populateUniqueAnchors(uniqueAnchors, seenAnchorIds, anchor));
		Anchors.value = uniqueAnchors;
	};

	const getScrollParent = () => {
		return container.value ?? window;
	};

	// Debounce for future syncing or autosaving features
	const { wait } = useDebounce();

	const lowlight = createLowlight(all);

	const editor = useEditor({
		content: content.value,
		editable: editable.value,
		extensions: [
			...articleExtensions,

			CodeBlockLowlight.configure({
				lowlight,
				languageClassPrefix: "language-",
			}),
			TableOfContents.configure({
				getIndex: getHierarchicalIndexes,
				onUpdate: (anchors) => populateAnchors(anchors),
				scrollParent: getScrollParent,
			}),
			NodeRange.configure({
				key: null,
			}),
		],
		onCreate: ({ editor }) => populateFields(editor),
		onUpdate: ({ editor }) => populateFields(editor),
	});

	onUnmounted(() => {
		if (editor.value) editor.value.destroy();
	});

	onBeforeRouteLeave(() => {
		store.clearSavedPayload();
	});

	const toggleEditable = () => {
		editable.value = !editable.value;
		if (editor.value) editor.value.setEditable(editable.value);

		addToast({
			message: `De editor is nu in ${editable.value ? "bewerkings" : "voorbeeld"}-modus.`,
			type: "info",
		});
	};

	const openOptions = ref(false);

	const toggleOptions = () => {
		openOptions.value = !openOptions.value;
	};

	const options = ref([
		{
			type: "set",
			title: "Yellow",
			color: "#fef3c7",
			action: () => {
				editor.value?.chain().focus().toggleHighlight({ color: "#fef3c7" }).run();
			},
			isActive: () => editor.value?.isActive("highlight", { color: "#fef3c7" }) || false,
		},
		{
			type: "set",
			title: "Green",
			color: "#bbf7d0",
			action: () => {
				editor.value?.chain().focus().toggleHighlight({ color: "#bbf7d0" }).run();
			},
			isActive: () => editor.value?.isActive("highlight", { color: "#bbf7d0" }) || false,
		},
		{
			type: "set",
			title: "Blue",
			color: "#bfdbfe",
			action: () => {
				editor.value?.chain().focus().toggleHighlight({ color: "#bfdbfe" }).run();
			},
			isActive: () => editor.value?.isActive("highlight", { color: "#bfdbfe" }) || false,
		},
		{
			type: "set",
			title: "Red",
			color: "#fecaca",
			action: () => {
				editor.value?.chain().focus().toggleHighlight({ color: "#fecaca" }).run();
			},
			isActive: () => editor.value?.isActive("highlight", { color: "#fecaca" }) || false,
		},

		{
			type: "unset",
			title: "Remove Highlight",
			color: "#ffffff",
			action: () => {
				editor.value?.chain().focus().unsetHighlight().run();
			},
		},
	]);

	const successMessage = editId.value ? "Het artikel is succesvol bijgewerkt." : "Het artikel is succesvol aangemaakt.";
	const failureMessage = editId.value
		? "Er is een fout opgetreden bij het bijwerken van het artikel. Probeer het later opnieuw."
		: "Er is een fout opgetreden bij het aanmaken van het artikel. Probeer het later opnieuw.";

	const { upload, setFormData } = useHandleFormData(successMessage, failureMessage);

	const request: requestOptions<{ id: number }> = {
		url: editId.value ? `/api/articles/${editId.value}` : "/api/articles",
		method: editId.value ? "PATCH" : "POST",
		onsuccess: async (response) => {
			await upload(response.data?.id);
			await store.refresh();
			await storage.refresh();
		},
		onfailure: () =>
			addToast({
				message: failureMessage,
				type: "error",
			}),
	};

	const appendToBody = async (values: Record<string, unknown>) => {
		addToast({
			message: "Het artikel wordt opgeslagen...",
			type: "info",
		});

		const { document, formData } = await createContent(content.value);
		content.value = document;
		setFormData(formData);

		return {
			...values,
			content: content.value,
			anchors: Anchors.value,
		};
	};
</script>
