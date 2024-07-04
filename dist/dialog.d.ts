declare function waitDialog<Y, N>(options: {
    yes: Required<Omit<DialogButton<Y>, "icon" | "condition">> & {
        icon?: string;
    };
    no: DialogButton<N> & {
        label: string;
    };
    template: string;
    title: string;
    id?: string;
    default?: "yes" | "no";
    data: Record<string, unknown>;
}): Promise<Y | N | null>;
type WaitDialogButton = Omit<DialogV2Button, "action" | "callback">;
declare function awaitDialog<T extends Record<string, unknown>>({ title, content, yes, no, classes, }: {
    title: string;
    content: string;
    yes: WaitDialogButton;
    no: WaitDialogButton;
    classes?: string[];
}): Promise<T | null | false>;
declare function confirmDialog({ title, content }: {
    title: string;
    content: string;
}): Promise<boolean | null>;
declare function promptDialog<T extends Record<string, unknown>>({ title, content, classes }: {
    title: string;
    content: string;
    classes?: string[];
}, { width }?: {
    width?: number | "auto";
}): Promise<T | null>;
export { awaitDialog, confirmDialog, promptDialog, waitDialog };
