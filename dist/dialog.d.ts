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
export { waitDialog };
