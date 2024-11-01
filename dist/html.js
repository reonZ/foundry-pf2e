"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupDragElement = exports.isValidClickEvent = exports.htmlQueryInClosest = exports.firstElementWithText = exports.elementDataset = exports.dataToDatasetString = exports.createTemporaryStyles = exports.createHTMLElement = exports.createGlobalEvent = exports.castType = exports.addListenerAll = exports.addListener = void 0;
const R = __importStar(require("remeda"));
const pf2e_1 = require("./pf2e");
function createGlobalEvent(event, listener, options) {
    let enabled = false;
    return {
        activate() {
            if (enabled)
                return;
            document.addEventListener(event, listener, options);
            enabled = true;
        },
        disable() {
            if (!enabled)
                return;
            document.removeEventListener(event, listener, options);
            enabled = false;
        },
        toggle(enabled) {
            if (enabled)
                this.activate();
            else
                this.disable();
        },
    };
}
exports.createGlobalEvent = createGlobalEvent;
function createHTMLElement(nodeName, { classes = [], dataset = {}, children = [], innerHTML, id } = {}) {
    const element = document.createElement(nodeName);
    if (id) {
        element.id = id;
    }
    if (classes.length > 0) {
        element.classList.add(...classes);
    }
    for (const [key, value] of Object.entries(dataset).filter(([, v]) => !R.isNullish(v) && v !== false)) {
        element.dataset[key] = value === true ? "" : String(value);
    }
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    else {
        element.append(...children);
    }
    return element;
}
exports.createHTMLElement = createHTMLElement;
function addListener(parent, selectors, ...args) {
    if (!(parent instanceof Element || parent instanceof Document))
        return;
    const element = parent.querySelector(selectors);
    if (!(element instanceof HTMLElement))
        return;
    const event = typeof args[0] === "string" ? args[0] : "click";
    const listener = typeof args[0] === "function" ? args[0] : args[1];
    const useCapture = typeof args[1] === "boolean" ? args[1] : args[2];
    element.addEventListener(event, (e) => listener(e, element), useCapture);
}
exports.addListener = addListener;
function addListenerAll(parent, selectors, ...args) {
    if (!(parent instanceof Element || parent instanceof Document))
        return;
    const elements = parent.querySelectorAll(selectors);
    const event = typeof args[0] === "string" ? args[0] : "click";
    const listener = typeof args[0] === "function" ? args[0] : args[1];
    const useCapture = typeof args[1] === "boolean" ? args[1] : args[2];
    for (const element of elements) {
        if (!(element instanceof HTMLElement))
            continue;
        element.addEventListener(event, (e) => listener(e, element), useCapture);
    }
}
exports.addListenerAll = addListenerAll;
function elementDataset(element) {
    return element.dataset;
}
exports.elementDataset = elementDataset;
function htmlQueryInClosest(el, closest, selector) {
    const closestElement = (0, pf2e_1.htmlClosest)(el, closest);
    if (!closestElement)
        return null;
    return (0, pf2e_1.htmlQuery)(closestElement, selector) ?? null;
}
exports.htmlQueryInClosest = htmlQueryInClosest;
function dataToDatasetString(data) {
    return R.pipe(Object.entries(data), R.map(([key, value]) => {
        if (value == null)
            return;
        const sluggifiedKey = key.replace(/\B([A-Z])/g, "-$1").toLowerCase();
        const stringified = typeof value === "object" ? JSON.stringify(value) : value;
        return `data-${sluggifiedKey}='${stringified}'`;
    }), R.filter(R.isTruthy), R.join(" "));
}
exports.dataToDatasetString = dataToDatasetString;
function castType(value, dataType) {
    if (value instanceof Array)
        return value.map((v) => castType(v, dataType));
    if ([undefined, null].includes(value) || dataType === "String")
        return value;
    // Boolean
    if (dataType === "Boolean") {
        if (value === "false")
            return false;
        return Boolean(value);
    }
    // Number
    else if (dataType === "Number") {
        if (value === "" || value === "null")
            return null;
        return Number(value);
    }
    // Serialized JSON
    else if (dataType === "JSON") {
        return JSON.parse(value);
    }
    // Other data types
    if (dataType && window[dataType] instanceof Function) {
        try {
            return window[dataType](value);
        }
        catch (err) {
            console.warn(`The form field value "${value}" was not able to be cast to the requested data type ${dataType}`);
        }
    }
    return value;
}
exports.castType = castType;
function createTemporaryStyles() {
    let _selectors = {};
    return {
        add(selector, token) {
            document.querySelector(selector)?.classList.add(token);
            (_selectors[selector] ??= new Set()).add(token);
        },
        remove(selector, token) {
            document.querySelector(selector)?.classList.remove(token);
            _selectors[selector]?.delete(token);
        },
        toggle(selector, token, force) {
            document.querySelector(selector)?.classList.toggle(token, force);
            const exist = _selectors[selector]?.has(token);
            if (force === true || (force === undefined && !exist)) {
                this.add(selector, token);
            }
            else if (force === false || (force === undefined && exist)) {
                this.remove(selector, token);
            }
        },
        clear(selector) {
            const keys = selector ? [selector] : Object.keys(_selectors);
            for (const key of keys) {
                const el = document.querySelector(key);
                el?.classList.remove(..._selectors[key]);
            }
            _selectors = {};
        },
    };
}
exports.createTemporaryStyles = createTemporaryStyles;
function firstElementWithText(el) {
    if (!(el instanceof HTMLElement))
        return null;
    const childNodes = el.childNodes;
    if (!childNodes.length)
        return null;
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
exports.firstElementWithText = firstElementWithText;
function isValidClickEvent(event) {
    return [0, 2].includes(event.button);
}
exports.isValidClickEvent = isValidClickEvent;
function setupDragElement(event, target, imgSrc, data, { imgSize = 16, classes } = {}) {
    if (!event.dataTransfer)
        return;
    const draggable = createHTMLElement("div", {
        classes,
        innerHTML: `<img src="${imgSrc}">`,
    });
    document.body.append(draggable);
    event.dataTransfer.setDragImage(draggable, imgSize, imgSize);
    event.dataTransfer.setData("text/plain", JSON.stringify(data));
    target.addEventListener("dragend", () => draggable.remove(), { once: true });
}
exports.setupDragElement = setupDragElement;
