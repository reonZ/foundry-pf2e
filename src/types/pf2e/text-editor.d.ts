export {};

declare global {
    interface ConvertXMLNodeOptions {
        /** The value of the data-visibility attribute to add to the span element */
        visibility?: UserVisibility | null;

        /** Whether or not it should be visible or not, which maps to visibility (for this release) */
        visible?: boolean;
        /**
         * Whether this piece of data belongs to the "self" actor or the target: used by UserVisibilityPF2e to
         * determine which actor's ownership to check
         */
        whose?: "self" | "opposer" | null;
        /** Any additional classes to add to the span element */
        classes?: string[];
        /** An optional tooltip to apply to the converted node */
        tooltip?: string;
    }

    class TextEditorPF2e extends TextEditor {
        /**
         * Convert an XML node into an HTML span element with data-visibility, data-whose, and class attributes
         * @param html    The HTML element containing the XML node: mutated by this method as part of node replacement
         * @param name    The name of the node to convert
         * @param options attributes to add to the generated span element
         * @returns The generated span element, or `null` if no `name` node was found
         */
        static convertXMLNode(
            html: HTMLElement,
            name: string,
            { visible, visibility, whose, tooltip, classes }: ConvertXMLNodeOptions
        ): HTMLElement | null;
    }
}
