"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDocument = void 0;
const dom_1 = require("./dom");
const utils_1 = require("./utils");
function resolveSheetDocument(html) {
    const sheet = ui.windows[Number(html.closest(".app.sheet")?.dataset.appid)] ?? null;
    const doc = sheet?.document;
    return doc &&
        (doc instanceof ActorPF2e || doc instanceof ItemPF2e || doc instanceof JournalEntry)
        ? doc
        : null;
}
/** Attempt to derive the related document via the sheet or chat message, handling any item summaries */
function resolveDocument(html) {
    // If an item UUID is provided, utilize it
    if (utils_1.UUIDUtils.isItemUUID(html.dataset.itemUuid)) {
        const document = fromUuidSync(html.dataset.itemUuid);
        if (document instanceof foundry.abstract.Document)
            return document;
    }
    // Attempt to figure out the document from the sheet. This might be an item description or actor notes.
    const sheetDocument = resolveSheetDocument(html);
    if (sheetDocument) {
        return sheetDocument;
    }
    // Return the chat message if there is one
    const messageId = (0, dom_1.htmlClosest)(html, "[data-message-id]")?.dataset.messageId;
    return messageId ? game.messages.get(messageId) ?? null : null;
}
exports.resolveDocument = resolveDocument;
