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
exports.waitDialog = exports.promptDialog = exports.confirmDialog = void 0;
const handlebars_1 = require("./handlebars");
const pf2e_1 = require("./pf2e");
const R = __importStar(require("remeda"));
async function waitDialog({ title, content, yes, no, classes, data, render, }, { width = "auto" } = {}) {
    content = await assureDialogContent(content, data);
    const buttons = [
        {
            action: "yes",
            icon: yes.icon ?? "fa-solid fa-check",
            label: yes.label,
            default: !no.default,
            callback: typeof yes.callback === "function"
                ? yes.callback
                : async (event, btn, html) => {
                    return createDialogData(html);
                },
        },
        {
            action: "no",
            icon: no.icon ?? "fa-solid fa-xmark",
            label: no.label,
            default: no.default,
            callback: typeof no.callback === "function" ? no.callback : async () => false,
        },
    ];
    return foundry.applications.api.DialogV2.wait({
        window: {
            title,
            contentClasses: classes ?? [],
        },
        position: { width },
        content,
        rejectClose: false,
        buttons,
        render,
    });
}
exports.waitDialog = waitDialog;
async function confirmDialog({ title, content, classes, data }) {
    content = await assureDialogContent(content, data);
    return foundry.applications.api.DialogV2.confirm({
        window: { title, contentClasses: classes ?? [] },
        content,
        rejectClose: false,
        yes: { default: true },
        no: { default: false },
    });
}
exports.confirmDialog = confirmDialog;
async function promptDialog({ title, content, classes, data, label }, { width = "auto" } = {}) {
    content = await assureDialogContent(content, data);
    return foundry.applications.api.DialogV2.prompt({
        content,
        window: { title, contentClasses: classes ?? [] },
        position: { width },
        rejectClose: false,
        ok: {
            ...(label ? { label } : undefined),
            callback: async (event, btn, html) => {
                return createDialogData(html);
            },
        },
    });
}
exports.promptDialog = promptDialog;
async function assureDialogContent(content, data) {
    content = typeof data === "object" ? await (0, handlebars_1.render)(content, data) : content;
    return content.startsWith("<") ? content : `<div>${content}</div>`;
}
function createDialogData(html) {
    const form = (0, pf2e_1.htmlQuery)(html, "form");
    if (!form)
        return null;
    const data = foundry.utils.flattenObject(new FormDataExtended(form).object);
    return R.mapValues(data, (value) => (typeof value === "string" ? value.trim() : value));
}
