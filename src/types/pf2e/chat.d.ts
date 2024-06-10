export {};

declare global {
    interface ActorTokenFlag {
        actor: ActorUUID | TokenDocumentUUID;
        token?: TokenDocumentUUID;
    }

    type ContextFlagOmission =
        | "actor"
        | "action"
        | "altUsage"
        | "createMessage"
        | "damaging"
        | "dosAdjustments"
        | "item"
        | "mapIncreases"
        | "notes"
        | "options"
        | "origin"
        | "range"
        | "target"
        | "token";

    interface CheckContextChatFlag extends Required<Omit<CheckCheckContext, ContextFlagOmission>> {
        actor: string | null;
        token: string | null;
        item?: string;
        dosAdjustments?: DegreeAdjustmentsRecord;
        roller?: "origin" | "target";
        origin: ActorTokenFlag | null;
        target: ActorTokenFlag | null;
        altUsage?: "thrown" | "melee" | null;
        notes: RollNoteSource[];
        options: string[];
    }

    class ChatMessagePF2e extends ChatMessage {
        constructor(
            data: DeepPartial<ChatMessageSourcePF2e> = {},
            context: MessageConstructionContext = {}
        );
    }

    interface ChatMessagePF2e extends ChatMessage {
        readonly _source: ChatMessageSourcePF2e;
        flags: ChatMessageFlagsPF2e;

        get user(): UserPF2e;
    }

    declare namespace ChatMessagePF2e {
        function createDocuments<TDocument extends foundry.abstract.Document>(
            this: ConstructorOf<TDocument>,
            data?: (TDocument | PreCreate<TDocument["_source"]>)[],
            operation?: Partial<MessageCreateOperationPF2e>
        ): Promise<TDocument[]>;

        function getSpeakerActor(speaker: foundry.documents.ChatSpeakerData): ActorPF2e | null;
    }
}
