declare function createGlobalEvent<TEvent extends keyof DocumentEventMap>(event: TEvent, listener: (this: Document, ev: DocumentEventMap[TEvent]) => any, options?: boolean | AddEventListenerOptions): {
    activate(): void;
    disable(): void;
    toggle(enabled: boolean): void;
};
declare function createHTMLElement<K extends keyof HTMLElementTagNameMap>(nodeName: K, options?: CreateHTMLElementOptionsWithChildren): HTMLElementTagNameMap[K];
declare function createHTMLElement<K extends keyof HTMLElementTagNameMap>(nodeName: K, options?: CreateHTMLElementOptionsWithInnerHTML): HTMLElementTagNameMap[K];
declare function createHTMLElement<K extends keyof HTMLElementTagNameMap>(nodeName: K, options?: CreateHTMLElementOptionsWithNeither): HTMLElementTagNameMap[K];
declare function addListener<K extends keyof HTMLElementTagNameMap, TEvent extends EventType = "click">(parent: MaybeHTML, selectors: K, ...args: ListenerCallbackArgs<HTMLElementTagNameMap[K], TEvent>): void;
declare function addListener<TEvent extends EventType = "click">(parent: MaybeHTML, selectors: string, ...args: ListenerCallbackArgs<HTMLElement, TEvent>): void;
declare function addListener<E extends HTMLElement, TEvent extends EventType = "click">(parent: MaybeHTML, selectors: string, ...args: ListenerCallbackArgs<E, TEvent>): void;
declare function addListenerAll<K extends keyof HTMLElementTagNameMap, TEvent extends EventType = "click">(parent: MaybeHTML, selectors: K, ...args: ListenerCallbackArgs<HTMLElementTagNameMap[K], TEvent>): void;
declare function addListenerAll<TEvent extends EventType = "click">(parent: MaybeHTML, selectors: string, ...args: ListenerCallbackArgs<HTMLElement, TEvent>): void;
declare function addListenerAll<E extends HTMLElement, TEvent extends EventType = "click">(parent: MaybeHTML, selectors: string, ...args: ListenerCallbackArgs<E, TEvent>): void;
declare function elementDataset<T extends Record<string, string>>(element: HTMLElement): T;
declare function elementDataset<T extends string>(element: HTMLElement): Record<T, string>;
declare function htmlQueryInClosest<K extends keyof HTMLElementTagNameMap>(el: MaybeHTML, closest: string, selector: K): HTMLElementTagNameMap[K] | null;
declare function htmlQueryInClosest(el: MaybeHTML, closest: string, selector: string): HTMLElement | null;
declare function htmlQueryInClosest<E extends HTMLElement = HTMLElement>(el: MaybeHTML, closest: string, selector: string): E | null;
declare function htmlQueryInParent<K extends keyof HTMLElementTagNameMap>(el: MaybeHTML, selector: K): HTMLElementTagNameMap[K] | null;
declare function htmlQueryInParent(el: MaybeHTML, selector: string): HTMLElement | null;
declare function htmlQueryInParent<E extends HTMLElement = HTMLElement>(el: MaybeHTML, selector: string): E | null;
declare function dataToDatasetString<TKey extends string>(data: DataToDatasetStringType<TKey>): string;
declare function castType(value: any, dataType?: string): unknown;
declare function createTemporaryStyles(): {
    add(selector: string, token: string): void;
    remove(selector: string, token: string): void;
    toggle(selector: string, token: string, force?: boolean): void;
    clear(selector?: string): void;
};
declare function firstElementWithText(el: Maybe<Element>): HTMLElement | null;
declare function isValidClickEvent(event: MouseEvent): boolean;
declare function setupDragElement(event: DragEvent, target: HTMLElement, imgSrc: string, data: object, { imgSize, classes }?: {
    imgSize?: number;
    classes?: string[];
}): void;
type DataToDatasetStringType<TKey extends string = string> = Partial<Record<TKey, Maybe<string | number | boolean | object>>>;
type ListenerCallback<TElement extends HTMLElement, TEvent extends EventType> = (event: HTMLElementEventMap[TEvent], element: TElement) => void;
type ListenerCallbackArgs<E extends HTMLElement, TEvent extends EventType> = [TEvent, ListenerCallback<E, TEvent>, boolean] | [TEvent, ListenerCallback<E, TEvent>] | [ListenerCallback<E, TEvent>, boolean] | [ListenerCallback<E, TEvent>];
interface CreateHTMLElementOptions {
    id?: string;
    classes?: string[];
    dataset?: Record<string, string | number | boolean | null | undefined>;
    children?: (Element | string)[] | HTMLCollection;
    innerHTML?: string;
}
interface CreateHTMLElementOptionsWithChildren extends CreateHTMLElementOptions {
    children: (Element | string)[] | HTMLCollection;
    innerHTML?: never;
}
interface CreateHTMLElementOptionsWithInnerHTML extends CreateHTMLElementOptions {
    children?: never;
    innerHTML: string;
}
interface CreateHTMLElementOptionsWithNeither extends CreateHTMLElementOptions {
    children?: never;
    innerHTML?: never;
}
export { addListener, addListenerAll, castType, createGlobalEvent, createHTMLElement, createTemporaryStyles, dataToDatasetString, elementDataset, firstElementWithText, htmlQueryInClosest, htmlQueryInParent, isValidClickEvent, setupDragElement, };
