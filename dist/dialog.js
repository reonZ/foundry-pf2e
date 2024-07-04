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
exports.waitDialog = exports.promptDialog = exports.confirmDialog = exports.awaitDialog = void 0;
const handlebars_1 = require("./handlebars");
const pf2e_1 = require("./pf2e");
const R = __importStar(require("remeda"));
async function waitDialog(options) {
    const yesIcon = options.yes.icon ?? "fa-solid fa-check";
    const noIcon = options.no.icon ?? "fa-solid fa-xmark";
    const buttons = {
        yes: {
            icon: `<i class='${yesIcon}'></i>`,
            label: options.yes.label,
            callback: options.yes.callback,
        },
        no: {
            icon: `<i class='${noIcon}'></i>`,
            label: options.no.label,
            callback: options.no.callback ?? (() => null),
        },
    };
    const content = await (0, handlebars_1.render)(options.template, options.data);
    return Dialog.wait({
        title: options.title,
        content,
        buttons,
        default: options.default ?? "yes",
        close: () => null,
    }, {
        id: options.id,
    });
}
exports.waitDialog = waitDialog;
function assureDialogContent(content) {
    return content.startsWith("<") ? content : `<div>${content}</div>`;
}
function awaitDialog({ title, content, yes, no, classes = [], }) {
    content = assureDialogContent(content);
    const buttons = [
        {
            action: "yes",
            icon: yes.icon ?? "fa-solid fa-check",
            label: yes.label,
            default: yes.default ?? true,
            callback: async (event, btn, html) => {
                return createDialogData(html);
            },
        },
        {
            action: "no",
            icon: no.icon ?? "fa-solid fa-xmark",
            label: no.label,
            callback: async () => false,
        },
    ];
    return foundry.applications.api.DialogV2.wait({
        window: {
            title,
            contentClasses: classes,
        },
        content,
        rejectClose: false,
        buttons,
    });
}
exports.awaitDialog = awaitDialog;
function createDialogData(html) {
    const form = (0, pf2e_1.htmlQuery)(html, "form");
    if (!form)
        return null;
    const data = foundry.utils.flattenObject(new FormDataExtended(form).object);
    return R.mapValues(data, (value) => (typeof value === "string" ? value.trim() : value));
}
function confirmDialog({ title, content }) {
    content = assureDialogContent(content);
    return foundry.applications.api.DialogV2.confirm({
        window: { title },
        content,
        rejectClose: false,
        yes: { default: true },
        no: { default: false },
    });
}
exports.confirmDialog = confirmDialog;
function promptDialog({ title, content, classes = [] }, { width = "auto" } = {}) {
    content = assureDialogContent(content);
    return foundry.applications.api.DialogV2.prompt({
        content,
        window: { title, contentClasses: classes },
        position: { width },
        rejectClose: false,
        ok: {
            callback: async (event, btn, html) => {
                return createDialogData(html);
            },
        },
    });
}
exports.promptDialog = promptDialog;
