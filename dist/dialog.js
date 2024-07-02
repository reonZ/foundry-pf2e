"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitDialog = exports.promptDialog = exports.confirmDialog = void 0;
const handlebars_1 = require("./handlebars");
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
function promptDialog({ title, content }, { width = "auto" } = {}) {
    content = assureDialogContent(content);
    return foundry.applications.api.DialogV2.prompt({
        content,
        window: { title },
        position: { width },
        rejectClose: false,
        ok: {
            callback: async (event, btn, html) => html,
        },
    });
}
exports.promptDialog = promptDialog;
