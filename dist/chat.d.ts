/// <reference types="jquery" />
/// <reference types="tooltipster" />
declare function createChatLink(docOrUuid: foundry.abstract.Document | string, options?: {
    label?: string;
    html: true;
}): Promise<string>;
declare function createChatLink(docOrUuid: foundry.abstract.Document | string, options: {
    label?: string;
    html?: false;
}): string;
declare function latestChatMessages(nb: number, fromMessage?: ChatMessagePF2e): Generator<{
    message: ChatMessagePF2e;
    li: JQuery<HTMLElement>;
}, void, unknown>;
declare function refreshLatestMessages(nb: number): Promise<void>;
export { createChatLink, latestChatMessages, refreshLatestMessages };
