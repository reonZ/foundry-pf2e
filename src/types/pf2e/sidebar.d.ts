export {};

declare global {
    class ActorDirectoryPF2e extends ActorDirectory<ActorPF2e<null>> {}

    class ChatLogPF2e extends ChatLog<ChatMessagePF2e> {}

    class CompendiumDirectoryPF2e extends CompendiumDirectory {}

    class HotbarPF2e extends Hotbar<MacroPF2e> {}
}
