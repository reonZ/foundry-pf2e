import { render } from "./handlebars";

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

async function confirmDialog({ title, content }: { title: string; content: string }) {
    if (!content.startsWith("<")) {
        content = `<div>${content}</div>`;
    }

    return foundry.applications.api.DialogV2.confirm({
        window: { title },
        content,
        rejectClose: false,
        yes: { default: true },
        no: { default: false },
    });
}

export { confirmDialog, waitDialog };
