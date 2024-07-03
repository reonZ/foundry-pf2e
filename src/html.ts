import * as R from "remeda";
import { htmlClosest, htmlQuery } from "./pf2e";

function createGlobalEvent<TEvent extends keyof DocumentEventMap>(
    event: TEvent,
    listener: (this: Document, ev: DocumentEventMap[TEvent]) => any,
    options?: boolean | AddEventListenerOptions
) {
    let enabled = false;

    return {
        activate() {
            if (enabled) return;
            document.addEventListener(event, listener, options);
            enabled = true;
        },
        disable() {
            if (!enabled) return;
            document.removeEventListener(event, listener, options);
            enabled = false;
        },
        toggle(enabled: boolean) {
            if (enabled) this.activate();
            else this.disable();
        },
    };
}

function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    options?: CreateHTMLElementOptionsWithChildren
): HTMLElementTagNameMap[K];
function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    options?: CreateHTMLElementOptionsWithInnerHTML
): HTMLElementTagNameMap[K];
function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    options?: CreateHTMLElementOptionsWithNeither
): HTMLElementTagNameMap[K];
function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    { classes = [], dataset = {}, children = [], innerHTML, id }: CreateHTMLElementOptions = {}
): HTMLElementTagNameMap[K] {
    const element = document.createElement(nodeName);

    if (id) {
        element.id = id;
    }

    if (classes.length > 0) {
        element.classList.add(...classes);
    }

    for (const [key, value] of Object.entries(dataset).filter(
        ([, v]) => !R.isNullish(v) && v !== false
    )) {
        element.dataset[key] = value === true ? "" : String(value);
    }

    if (innerHTML) {
        element.innerHTML = innerHTML;
    } else {
        element.append(...children);
    }

    return element;
}

function addListener<K extends keyof HTMLElementTagNameMap, TEvent extends EventType = "click">(
    parent: MaybeHTML,
    selectors: K,
    ...args: ListenerCallbackArgs<HTMLElementTagNameMap[K], TEvent>
): void;
function addListener<TEvent extends EventType = "click">(
    parent: MaybeHTML,
    selectors: string,
    ...args: ListenerCallbackArgs<HTMLElement, TEvent>
): void;
function addListener<E extends HTMLElement, TEvent extends EventType = "click">(
    parent: MaybeHTML,
    selectors: string,
    ...args: ListenerCallbackArgs<E, TEvent>
): void;
function addListener(
    parent: MaybeHTML,
    selectors: string,
    ...args: ListenerCallbackArgs<HTMLElement, EventType>
): void {
    if (!(parent instanceof Element || parent instanceof Document)) return;

    const element = parent.querySelector(selectors);
    if (!(element instanceof HTMLElement)) return;

    const event = typeof args[0] === "string" ? args[0] : "click";
    const listener = typeof args[0] === "function" ? args[0] : args[1];
    const useCapture = typeof args[1] === "boolean" ? args[1] : args[2];

    element.addEventListener(event, (e) => listener(e, element), useCapture);
}

function addListenerAll<K extends keyof HTMLElementTagNameMap, TEvent extends EventType = "click">(
    parent: MaybeHTML,
    selectors: K,
    ...args: ListenerCallbackArgs<HTMLElementTagNameMap[K], TEvent>
): void;
function addListenerAll<TEvent extends EventType = "click">(
    parent: MaybeHTML,
    selectors: string,
    ...args: ListenerCallbackArgs<HTMLElement, TEvent>
): void;
function addListenerAll<E extends HTMLElement, TEvent extends EventType = "click">(
    parent: MaybeHTML,
    selectors: string,
    ...args: ListenerCallbackArgs<E, TEvent>
): void;
function addListenerAll(
    parent: MaybeHTML,
    selectors: string,
    ...args: ListenerCallbackArgs<HTMLElement, EventType>
): void {
    if (!(parent instanceof Element || parent instanceof Document)) return;

    const elements = parent.querySelectorAll(selectors);
    const event = typeof args[0] === "string" ? args[0] : "click";
    const listener = typeof args[0] === "function" ? args[0] : args[1];
    const useCapture = typeof args[1] === "boolean" ? args[1] : args[2];

    for (const element of elements) {
        if (!(element instanceof HTMLElement)) continue;
        element.addEventListener(event, (e) => listener(e, element), useCapture);
    }
}

function elementDataset<T extends Record<string, string>>(element: HTMLElement): T;
function elementDataset<T extends string>(element: HTMLElement): Record<T, string>;
function elementDataset(element: HTMLElement): Record<string, string> {
    return element.dataset as Record<string, string>;
}

function htmlQueryInClosest<K extends keyof HTMLElementTagNameMap>(
    el: MaybeHTML,
    closest: string,
    selector: K
): HTMLElementTagNameMap[K] | null;
function htmlQueryInClosest(el: MaybeHTML, closest: string, selector: string): HTMLElement | null;
function htmlQueryInClosest<E extends HTMLElement = HTMLElement>(
    el: MaybeHTML,
    closest: string,
    selector: string
): E | null;
function htmlQueryInClosest(el: MaybeHTML, closest: string, selector: string): HTMLElement | null {
    const closestElement = htmlClosest(el, closest);
    if (!closestElement) return null;

    return htmlQuery(closestElement, selector) ?? null;
}

function dataToDatasetString<TKey extends string>(data: DataToDatasetStringType<TKey>) {
    return R.pipe(
        Object.entries(data),
        R.map(([key, value]) => {
            if (value == null) return;

            const sluggifiedKey = game.pf2e.system.sluggify(key);
            const stringified = typeof value === "object" ? JSON.stringify(value) : value;

            return `data-${sluggifiedKey}='${stringified}'`;
        }),
        R.filter(R.isTruthy),
        R.join(" ")
    );
}

type DataToDatasetStringType<TKey extends string = string> = Partial<
    Record<TKey, Maybe<string | number | boolean | object>>
>;

type ListenerCallback<TElement extends HTMLElement, TEvent extends EventType> = (
    event: HTMLElementEventMap[TEvent],
    element: TElement
) => void;

type ListenerCallbackArgs<E extends HTMLElement, TEvent extends EventType> =
    | [TEvent, ListenerCallback<E, TEvent>, boolean]
    | [TEvent, ListenerCallback<E, TEvent>]
    | [ListenerCallback<E, TEvent>, boolean]
    | [ListenerCallback<E, TEvent>];

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

export {
    addListener,
    addListenerAll,
    createGlobalEvent,
    createHTMLElement,
    dataToDatasetString,
    elementDataset,
    htmlQueryInClosest,
};
