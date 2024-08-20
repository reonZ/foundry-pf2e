export {};

declare global {
    namespace modifiersMatter {
        type SIGNIFICANCE = "ESSENTIAL" | "HELPFUL" | "NONE" | "HARMFUL" | "DETRIMENTAL";

        type SignificantModifier = {
            appliedTo: "roll";
            name: string;
            significance: SIGNIFICANCE;
            value: number;
        };
    }

    var pf2eMm: Maybe<{
        checkIfChatMessageShouldHaveHighlights(msg: ChatMessagePF2e): boolean;
        getSignificantModifiersOfMessage(
            msg: ChatMessagePF2e
        ): modifiersMatter.SignificantModifier[];
    }>;
}
