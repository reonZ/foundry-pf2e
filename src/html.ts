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

function htmlQueryInParent<K extends keyof HTMLElementTagNameMap>(
    el: MaybeHTML,
    selector: K
): HTMLElementTagNameMap[K] | null;
function htmlQueryInParent(el: MaybeHTML, selector: string): HTMLElement | null;
function htmlQueryInParent<E extends HTMLElement = HTMLElement>(
    el: MaybeHTML,
    selector: string
): E | null;
function htmlQueryInParent(el: MaybeHTML, selector: string): HTMLElement | null {
    const parent = (el instanceof HTMLElement && el.parentElement) || null;
    return htmlQuery(parent, selector) ?? null;
}

function dataToDatasetString<TKey extends string>(data: DataToDatasetStringType<TKey>) {
    return R.pipe(
        Object.entries(data),
        R.map(([key, value]) => {
            if (value == null) return;

            const sluggifiedKey = key.replace(/\B([A-Z])/g, "-$1").toLowerCase();
            const stringified = typeof value === "object" ? JSON.stringify(value) : value;

            return `data-${sluggifiedKey}='${stringified}'`;
        }),
        R.filter(R.isTruthy),
        R.join(" ")
    );
}

function castType(value: any, dataType?: string): unknown {
    if (value instanceof Array) return value.map((v) => castType(v, dataType));
    if ([undefined, null].includes(value) || dataType === "String") return value;

    // Boolean
    if (dataType === "Boolean") {
        if (value === "false") return false;
        return Boolean(value);
    }

    // Number
    else if (dataType === "Number") {
        if (value === "" || value === "null") return null;
        return Number(value);
    }

    // Serialized JSON
    else if (dataType === "JSON") {
        return JSON.parse(value);
    }

    // Other data types
    if (dataType && window[dataType as keyof typeof window] instanceof Function) {
        try {
            return window[dataType as keyof typeof window](value);
        } catch (err) {
            console.warn(
                `The form field value "${value}" was not able to be cast to the requested data type ${dataType}`
            );
        }
    }

    return value;
}

function createTemporaryStyles() {
    let _selectors: Record<string, Set<string>> = {};

    return {
        add(selector: string, token: string) {
            document.querySelector(selector)?.classList.add(token);
            (_selectors[selector] ??= new Set()).add(token);
        },
        remove(selector: string, token: string) {
            document.querySelector(selector)?.classList.remove(token);
            _selectors[selector]?.delete(token);
        },
        toggle(selector: string, token: string, force?: boolean) {
            document.querySelector(selector)?.classList.toggle(token, force);

            const exist = _selectors[selector]?.has(token);

            if (force === true || (force === undefined && !exist)) {
                this.add(selector, token);
            } else if (force === false || (force === undefined && exist)) {
                this.remove(selector, token);
            }
        },
        clear(selector?: string) {
            const keys = selector ? [selector] : Object.keys(_selectors);

            for (const key of keys) {
                const el = document.querySelector(key);
                el?.classList.remove(..._selectors[key]);
            }

            _selectors = {};
        },
    };
}

function firstElementWithText(el: Maybe<Element>): HTMLElement | null {
    if (!(el instanceof HTMLElement)) return null;

    const childNodes = el.childNodes;
    if (!childNodes.length) return null;

    for (const child of childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            return el;
        }
    }

    for (const child of el.children) {
        const withText = firstElementWithText(child);
        if (withText) {
            return withText;
        }
    }

    return null;
}

function isValidClickEvent(event: MouseEvent) {
    return [0, 2].includes(event.button);
}

function setupDragElement(
    event: DragEvent,
    target: HTMLElement,
    imgSrc: string,
    data: object,
    { imgSize = 16, classes }: { imgSize?: number; classes?: string[] } = {}
) {
    if (!event.dataTransfer) return;

    const draggable = createHTMLElement("div", {
        classes,
        innerHTML: `<img src="${imgSrc}">`,
    });

    document.body.append(draggable);

    event.dataTransfer.setDragImage(draggable, imgSize, imgSize);
    event.dataTransfer.setData("text/plain", JSON.stringify(data));

    target.addEventListener("dragend", () => draggable.remove(), { once: true });
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
    castType,
    createGlobalEvent,
    createHTMLElement,
    createTemporaryStyles,
    dataToDatasetString,
    elementDataset,
    firstElementWithText,
    htmlQueryInClosest,
    htmlQueryInParent,
    isValidClickEvent,
    setupDragElement,
};
