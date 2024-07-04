import { render } from "./handlebars";
import { htmlQuery } from "./pf2e";
import * as R from "remeda";

async function waitDialog<Y, N>(options: {
    yes: Required<Omit<DialogButton<Y>, "icon" | "condition">> & { icon?: string };
    no: DialogButton<N> & { label: string };
    template: string;
    title: string;
    id?: string;
    default?: "yes" | "no";
    data: Record<string, unknown>;
}): Promise<Y | N | null> {
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
            callback: options.no.callback ?? ((() => null) as () => N),
        },
    } as const;

    const content = await render(options.template, options.data);

    return Dialog.wait<Y | N>(
        {
            title: options.title,
            content,
            buttons,
            default: options.default ?? "yes",
            close: () => null,
        },
        {
            id: options.id,
        }
    );
}

function assureDialogContent(content: string) {
    return content.startsWith("<") ? content : `<div>${content}</div>`;
}

type WaitDialogButton = Omit<DialogV2Button, "action" | "callback">;

function awaitDialog<T extends Record<string, unknown>>({
    title,
    content,
    yes,
    no,
    classes = [],
}: {
    title: string;
    content: string;
    yes: WaitDialogButton;
    no: WaitDialogButton;
    classes?: string[];
}): Promise<T | null | false> {
    content = assureDialogContent(content);

    const buttons: DialogV2Button[] = [
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

function createDialogData(html: HTMLElement) {
    const form = htmlQuery(html, "form");
    if (!form) return null;

    const data = foundry.utils.flattenObject(new FormDataExtended(form).object);
    return R.mapValues(data, (value) => (typeof value === "string" ? value.trim() : value));
}

function confirmDialog({ title, content }: { title: string; content: string }) {
    content = assureDialogContent(content);

    return foundry.applications.api.DialogV2.confirm({
        window: { title },
        content,
        rejectClose: false,
        yes: { default: true },
        no: { default: false },
    });
}

function promptDialog<T extends Record<string, unknown>>(
    { title, content, classes = [] }: { title: string; content: string; classes?: string[] },
    { width = "auto" }: { width?: number | "auto" } = {}
): Promise<T | null> {
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

export { awaitDialog, confirmDialog, promptDialog, waitDialog };
