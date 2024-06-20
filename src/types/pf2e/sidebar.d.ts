export {};

declare global {
    class ActorDirectoryPF2e extends ActorDirectory<ActorPF2e<null>> {}

    class ChatLogPF2e extends ChatLog<ChatMessagePF2e> {}

    class CompendiumDirectoryPF2e extends CompendiumDirectory {}

    type HotbarDropData = Partial<DropCanvasData> & {
        actorId?: string;
        actorUUID?: ActorUUID;
        slot?: number;
        skill?: string;
        skillName?: string;
        index?: number;
        itemType?: string;
        elementTrait?: string;
        pf2e?: {
            type: string;
            property: string;
            label: string;
        };
    };

    type RollOptionData = {
        label: string;
        domain: string;
        option: string;
    };

    class HotbarPF2e extends Hotbar<MacroPF2e> {}
}
