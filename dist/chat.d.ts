declare function createChatLink(docOrUuid: foundry.abstract.Document | string, options: {
    label?: string;
    html: false;
}): string;
declare function createChatLink(docOrUuid: foundry.abstract.Document | string, options?: {
    label?: string;
    html?: true;
}): Promise<string>;
export { createChatLink };
