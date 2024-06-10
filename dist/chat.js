"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatLink = void 0;
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
