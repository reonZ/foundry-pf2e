declare function waitDialog<T extends any>({ title, content, yes, no, classes, data, }: BaseOptions & {
    yes: Omit<DialogV2Button, "action">;
    no: Omit<DialogV2Button, "action">;
}, { width }?: DialogExtraOptions): Promise<T | null | false>;
declare function confirmDialog({ title, content, classes, data }: BaseOptions): Promise<boolean | null>;
declare function promptDialog<T extends Record<string, unknown>>({ title, content, classes, data, label }: BaseOptions & {
    label?: string;
}, { width }?: DialogExtraOptions): Promise<T | null>;
type DialogExtraOptions = {
    width?: number | "auto";
};
type BaseOptions = {
    title: string;
    content: string;
    classes?: string[];
    data?: Record<string, any>;
};
export { confirmDialog, promptDialog, waitDialog };
