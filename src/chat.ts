function createChatLink(
    docOrUuid: foundry.abstract.Document | string,
    options?: { label?: string; html: true }
): Promise<string>;
function createChatLink(
    docOrUuid: foundry.abstract.Document | string,
    options: { label?: string; html?: false }
): string;
function createChatLink(
    docOrUuid: foundry.abstract.Document | string,
    { label, html }: { label?: string; html?: boolean } = {}
): Promisable<string> {
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

export { createChatLink };
