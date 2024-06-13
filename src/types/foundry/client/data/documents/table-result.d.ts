import type { ClientBaseTableResult } from "./client-base-mixes.d.ts";

declare global {
    /**
     * The client-side TableResult document which extends the common BaseTableResult document model.
     *
     * @see {@link RollTable} The RollTable document type which contains TableResult documents
     */
    class TableResult<
        TParent extends RollTable | null = RollTable
    > extends ClientBaseTableResult<TParent> {
        declare drawn: boolean;
        declare text: string;
        declare documentCollection: string;
        declare documentId: string;

        /** A path reference to the icon image used to represent this result */
        get icon(): string;

        /**
         * Prepare a string representation for the result which (if possible) will be a dynamic link or otherwise plain
         * text
         */
        getChatText(): string;
    }
}
