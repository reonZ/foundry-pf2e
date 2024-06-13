"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshLatestMessages = exports.latestChatMessages = exports.createChatLink = void 0;
function createChatLink(docOrUuid, { label, html } = {}) {
    const isDocument = docOrUuid instanceof foundry.abstract.Document;
    if (!label && isDocument) {
        label = docOrUuid.name;
    }
    let link = `@UUID[${isDocument ? docOrUuid.uuid : docOrUuid}]`;
    if (label) {
        link = `${link}{${label}}`;
    }
    return html ? TextEditor.enrichHTML(link) : link;
}
exports.createChatLink = createChatLink;
function* latestChatMessages(nb, fromMessage) {
    const chat = ui.chat?.element;
    if (!chat)
        return;
    const messages = game.messages.contents;
    const start = (fromMessage ? messages.findLastIndex((m) => m === fromMessage) : messages.length) - 1;
    for (let i = start; i >= start - nb; i--) {
        const message = messages[i];
        if (!message)
            return;
        const li = chat.find(`[data-message-id=${message.id}]`);
        if (!li.length)
            continue;
        yield { message, li };
    }
}
exports.latestChatMessages = latestChatMessages;
async function refreshLatestMessages(nb) {
    for (const { message, li } of latestChatMessages(20)) {
        const html = await message.getHTML();
        li.replaceWith(html);
    }
}
exports.refreshLatestMessages = refreshLatestMessages;
