import { render } from "./handlebars";
import { htmlQuery } from "./pf2e";
import * as R from "remeda";

let AnimationlessDialog: typeof foundry.applications.api.DialogV2 | null = null;

function getDialogClass(animation = true): typeof foundry.applications.api.DialogV2 {
    if (animation) {
        return foundry.applications.api.DialogV2;
    }

    if (AnimationlessDialog) {
        return AnimationlessDialog;
    }

    return (AnimationlessDialog = class extends foundry.applications.api.DialogV2 {
        async close(options?: ApplicationClosingOptions) {
            return super.close({ animate: false });
        }
    });
}

async function waitDialog<T extends any>(
    {
        title,
        content,
        yes,
        no,
        classes,
        data,
        render,
    }: BaseOptions & {
        yes: Omit<DialogV2Button, "action">;
        no: Omit<DialogV2Button, "action">;
    },
    { id, width = "auto", animation }: DialogExtraOptions = {}
): Promise<T | null | false> {
    content = await assureDialogContent(content, data);

    const buttons: DialogV2Button[] = [
        {
            action: "yes",
            icon: yes.icon ?? "fa-solid fa-check",
            label: yes.label,
            default: !no.default,
            callback:
                typeof yes.callback === "function"
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

    const options: DialogV2WaitOptions = {
        window: {
            title,
            contentClasses: classes ?? [],
        },
        position: { width },
        content,
        rejectClose: false,
        buttons,
        render,
        close: () => {},
    };

    if (id) options.id = id;

    return getDialogClass(animation).wait(options);
}

async function confirmDialog({ title, content, classes, data }: BaseOptions) {
    content = await assureDialogContent(content, data);

    return getDialogClass().confirm({
        window: { title, contentClasses: classes ?? [] },
        content,
        rejectClose: false,
        yes: { default: true },
        no: { default: false },
    });
}

async function promptDialog<T extends Record<string, unknown>>(
    { title, content, classes, data, label, render }: BaseOptions & { label?: string },
    { width = "auto", id, animation }: DialogExtraOptions = {}
): Promise<T | null> {
    content = await assureDialogContent(content, data);

    const ok: DialogV2PromptOptions["ok"] = {
        callback: async (event, btn, html) => {
            return createDialogData(html);
        },
    };

    if (label) ok.label = label;

    const options: DialogV2PromptOptions = {
        content,
        window: { title, contentClasses: classes ?? [] },
        position: { width },
        rejectClose: false,
        render,
        ok,
    };

    if (id) options.id = id;

    return getDialogClass(animation).prompt(options);
}

async function assureDialogContent(content: string, data?: Record<string, any>) {
    content = typeof data === "object" ? await render(content, data) : content;
    return content.startsWith("<") ? content : `<div>${content}</div>`;
}

function createDialogData(html: HTMLElement) {
    const form = htmlQuery(html, "form");
    if (!form) return null;

    const data = foundry.utils.flattenObject(new FormDataExtended(form).object);
    return R.mapValues(data, (value) => (typeof value === "string" ? value.trim() : value));
}

type DialogExtraOptions = {
    id?: string;
    width?: number | "auto";
    animation?: false;
};

type BaseOptions = {
    title: string;
    content: string;
    classes?: string[];
    data?: Record<string, any>;
    render?: DialogV2RenderCallback;
};

export type { DialogExtraOptions };
export { confirmDialog, createDialogData, promptDialog, waitDialog };
