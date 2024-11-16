import { htmlClosest } from "./dom";
import { UUIDUtils } from "./utils";

function resolveSheetDocument(html: HTMLElement): ClientDocument | null {
    const sheet: { id?: string; document?: unknown } | null =
        ui.windows[Number(html.closest<HTMLElement>(".app.sheet")?.dataset.appid)] ?? null;
    const doc = sheet?.document;
    return doc &&
        (doc instanceof ActorPF2e || doc instanceof ItemPF2e || doc instanceof JournalEntry)
        ? doc
        : null;
}

/** Attempt to derive the related document via the sheet or chat message, handling any item summaries */
function resolveDocument(html: HTMLElement): ClientDocument | null {
    // If an item UUID is provided, utilize it
    if (UUIDUtils.isItemUUID(html.dataset.itemUuid)) {
        const document = fromUuidSync(html.dataset.itemUuid);
        if (document instanceof foundry.abstract.Document) return document;
    }

    // Attempt to figure out the document from the sheet. This might be an item description or actor notes.
    const sheetDocument = resolveSheetDocument(html);
    if (sheetDocument) {
        return sheetDocument;
    }

    // Return the chat message if there is one
    const messageId = htmlClosest(html, "[data-message-id]")?.dataset.messageId;
    return messageId ? game.messages.get(messageId) ?? null : null;
}

export { resolveDocument };
