declare function createChatLink(docOrUuid: foundry.abstract.Document | string, options?: {
    label?: string;
    html: true;
}): Promise<string>;
declare function createChatLink(docOrUuid: foundry.abstract.Document | string, options: {
    label?: string;
    html?: false;
}): string;
export { createChatLink };
