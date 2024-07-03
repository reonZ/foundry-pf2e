export {};

declare global {
    interface ReadonlyArray<T> {
        includes(searchElement: any, fromIndex?: number): searchElement is T;
    }

    type Promisable<T> = Promise<T> | T;

    namespace PIXI {
        type FederatedMouseEvent = PIXI.FederatedEvent<MouseEvent | PointerEvent | TouchEvent> &
            MouseEvent;
    }

    type Pairs<T> = Array<{ [K in keyof T]-?: [key: K, value: Required<T>[K]] }[keyof T]>;

    type MaybeHTML = Maybe<Document | Element | EventTarget>;

    type EventType = keyof HTMLElementEventMap;

    type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
        {
            [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
        }[Keys];

    type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
        {
            [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>;
        }[Keys];

    type StringNumber = `${number}`;
    type StringBoolean = `${boolean}`;

    type SocketCallback<T = any> = (packet: T, senderId: string) => void;

    type FoundryDocument = foundry.abstract.Document;

    function getDocumentClass(name: "ChatMessage"): typeof ChatMessagePF2e;
    function getDocumentClass(name: "Combatant"): typeof CombatantPF2e;
    function getDocumentClass(name: "Macro"): typeof MacroPF2e;
    function getDocumentClass(name: "Actor"): typeof ActorPF2e;
    function getDocumentClass(name: "Item"): typeof ItemPF2e;
}
