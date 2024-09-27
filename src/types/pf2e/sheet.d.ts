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

    interface TagifyTraitOptions {
        sourceTraits?: Iterable<string>;
        record?: Record<string, string>;
    }

    interface TagifyEntry {
        id: string;
        value: string;
        /** If true, the tag will exist in tagify but unremovable. */
        readonly: boolean;
        /**
         * If true, it will be hidden from tagify itself but exist in submit data.
         * Tagify treats any value as true, even false or null.
         */
        hidden?: true;
    }
}
