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

    type ChatMessageSourcePF2e = foundry.documents.ChatMessageSource & {
        flags: ChatMessageFlagsPF2e;
    };

    interface ItemOriginFlag {
        actor?: ActorUUID;
        type: ItemType;
        uuid: string;
        castRank?: number;
        messageId?: string;
        variant?: { overlays: string[] };
        rollOptions?: string[];
    }

    interface AppliedDamageFlag {
        uuid: ActorUUID;
        isHealing: boolean;
        isReverted?: boolean;
        persistent: string[];
        shield: {
            id: string;
            damage: number;
        } | null;
        updates: { path: string; value: number }[];
    }

    type ChatMessageFlagsPF2e = foundry.documents.ChatMessageFlags & {
        pf2e: {
            damageRoll?: DamageRollFlag;
            context?: ChatContextFlag;
            origin?: ItemOriginFlag | null;
            casting?: { id: string; tradition: MagicTradition; embeddedSpell?: SpellSource } | null;
            modifiers?: RawModifier[];
            dice?: RawDamageDice[];
            preformatted?: "flavor" | "content" | "both";
            journalEntry?: DocumentUUID;
            appliedDamage?: AppliedDamageFlag | null;
            [key: string]: unknown;
        };
        core: NonNullable<foundry.documents.ChatMessageFlags["core"]>;
    };

    interface DamageDamageContextFlag
        extends Required<Omit<DamageDamageContext, ContextFlagOmission | "self">> {
        actor: string | null;
        token: string | null;
        item?: string;
        mapIncreases?: ZeroToTwo;
        target: ActorTokenFlag | null;
        notes: RollNoteSource[];
        options: string[];
    }

    interface SpellCastContextFlag {
        type: "spell-cast";
        domains: string[];
        options: string[];
        outcome?: DegreeOfSuccessString;
        /** The roll mode (i.e., 'roll', 'blindroll', etc) to use when rendering this roll. */
        rollMode?: RollMode;
    }

    interface SelfEffectContextFlag {
        type: "self-effect";
        item: string;
        domains?: never;
        options?: never;
        outcome?: never;
    }

    type ChatContextFlag =
        | CheckContextChatFlag
        | DamageDamageContextFlag
        | SpellCastContextFlag
        | SelfEffectContextFlag;

    interface DamageRollFlag {
        outcome: DegreeOfSuccessString;
        total: number;
        traits: string[];
        types: Record<string, Record<string, number>>;
        diceResults: Record<string, Record<string, DieResult[]>>;
        baseDamageDice: number;
    }

    interface DieResult {
        faces: number;
        result: number;
    }

    interface ActorTokenFlag {
        actor: ActorUUID | TokenDocumentUUID;
        token?: TokenDocumentUUID;
    }

    class ChatMessagePF2e extends ChatMessage {
        constructor(
            data?: DeepPartial<ChatMessageSourcePF2e>,
            context?: MessageConstructionContext
        );
    }

    interface ChatMessagePF2e extends ChatMessage {
        readonly _source: ChatMessageSourcePF2e;
        flags: ChatMessageFlagsPF2e;

        get user(): UserPF2e;
    }

    // declare namespace ChatMessagePF2e {
    //     function createDocuments<TDocument extends foundry.abstract.Document>(
    //         this: ConstructorOf<TDocument>,
    //         data?: (TDocument | PreCreate<TDocument["_source"]>)[],
    //         operation?: Partial<MessageCreateOperationPF2e>
    //     ): Promise<TDocument[]>;

    //     function getSpeakerActor(speaker: foundry.documents.ChatSpeakerData): ActorPF2e | null;
    // }
}
