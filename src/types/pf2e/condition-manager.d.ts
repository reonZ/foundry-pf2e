export {};

declare global {
    class ConditionManager {
        /**
         * Get a condition using the condition name.
         * @param slug A condition slug
         */
        static getCondition(
            slug: ConditionSlug,
            modifications?: DeepPartial<ConditionSource>
        ): ConditionPF2e<null>;
        static getCondition(
            slug: string,
            modifications?: DeepPartial<ConditionSource>
        ): ConditionPF2e<null> | null;
        static getCondition(
            slug: string,
            modifications?: DeepPartial<ConditionSource>
        ): ConditionPF2e<null> | null;
    }
}
