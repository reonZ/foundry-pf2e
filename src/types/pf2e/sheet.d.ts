export {};

declare global {
    interface SheetOption {
        value: string;
        label: string;
        selected: boolean;
    }

    type SheetOptions = {
        [x: string]: SheetOption;
    };

    interface TraitTagifyEntry {
        id: string;
        value: string;
        readonly: boolean;
    }

    interface TagifyTraitOptions {
        sourceTraits?: Iterable<string>;
        record: Record<string, string>;
    }

    interface TraitTagifyEntry {
        id: string;
        value: string;
        readonly: boolean;
    }
}
