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
exports.htmlQueryInClosest = exports.elementDataset = exports.dataToDatasetString = exports.createHTMLElement = exports.createGlobalEvent = exports.addListenerAll = exports.addListener = void 0;
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
    return (0, pf2e_1.htmlClosest)(el, closest)?.querySelector(selector) ?? null;
}
exports.htmlQueryInClosest = htmlQueryInClosest;
function dataToDatasetString(data) {
    return Object.entries(data)
        .map(([key, value]) => {
        const stringified = typeof value === "object" ? JSON.stringify(value) : value;
        return `data-${key}='${stringified}'`;
    })
        .join(" ");
}
exports.dataToDatasetString = dataToDatasetString;
