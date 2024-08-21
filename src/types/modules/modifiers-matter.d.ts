export {};

declare global {
    namespace modifiersMatter {
        type SIGNIFICANCE = "ESSENTIAL" | "HELPFUL" | "NONE" | "HARMFUL" | "DETRIMENTAL";

        type SignificantModifier = {
            appliedTo: "roll" | "dc";
            name: string;
            significance: SIGNIFICANCE;
            value: number;
        };
    }

    var pf2eMm: Maybe<{
        checkIfChatMessageShouldHaveHighlights(msg: ChatMessagePF2e): boolean;
        getSignificantModifiersOfMessage(
            msg: Pick<ChatMessagePF2e, "flags" | "rolls" | "content" | "flavor">
        ): modifiersMatter.SignificantModifier[];
    }>;
}
