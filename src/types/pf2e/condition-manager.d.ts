export { };

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

        static updateConditionValue(
            itemId: string,
            actor: ActorPF2e,
            value: number
        ): Promise<void>;
        static updateConditionValue(
            itemId: string,
            token: TokenPF2e,
            value: number
        ): Promise<void>;
        static updateConditionValue(
            itemId: string,
            actorOrToken: ActorPF2e | TokenPF2e,
            value: number
        ): Promise<void>;
    }
}
