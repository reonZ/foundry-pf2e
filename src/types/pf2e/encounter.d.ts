export {};

declare global {
    interface RollInitiativeOptionsPF2e extends RollInitiativeOptions, StatisticRollParameters {
        secret?: boolean;
    }

    interface EncounterBudgets {
        trivial: number;
        low: number;
        moderate: number;
        severe: number;
        extreme: number;
    }

    type ThreatRating = keyof EncounterBudgets;

    interface EncounterMetrics {
        threat: ThreatRating;
        budget: { spent: number; max: number; partyLevel: number };
        award: { xp: number; recipients: ActorPF2e[] };
        participants: { party: ActorPF2e[]; opposition: ActorPF2e[] };
    }

    type RolledCombatant<TEncounter extends EncounterPF2e = EncounterPF2e> = CombatantPF2e<
        TEncounter,
        TokenDocumentPF2e
    > & {
        initiative: number;
    };

    class EncounterPF2e extends Combat {
        declare metrics: EncounterMetrics | null;
    }

    interface EncounterPF2e extends Combat {
        readonly combatants: foundry.abstract.EmbeddedCollection<
            CombatantPF2e<this, TokenDocumentPF2e | null>
        >;

        scene: ScenePF2e;

        rollNPC(options: RollInitiativeOptionsPF2e): Promise<this>;
    }

    class EncounterTrackerPF2e<
        TEncounter extends EncounterPF2e | null = EncounterPF2e | null
    > extends CombatTracker<TEncounter> {
        validateDrop(event: any): void;
        setInitiativeFromDrop(
            newOrder: RolledCombatant<NonNullable<TEncounter>>[],
            dropped: RolledCombatant<NonNullable<TEncounter>>
        ): void;
        saveNewOrder(newOrder: RolledCombatant<NonNullable<TEncounter>>[]): Promise<void>;
    }

    class CombatantPF2e<
        TParent extends EncounterPF2e | null = EncounterPF2e | null,
        TTokenDocument extends TokenDocumentPF2e | null = TokenDocumentPF2e | null
    > extends Combatant<TParent, TTokenDocument> {
        get encounter(): TParent;
        get playersCanSeeName(): boolean;
    }

    interface CombatantPF2e<
        TParent extends EncounterPF2e | null = EncounterPF2e | null,
        TTokenDocument extends TokenDocumentPF2e | null = TokenDocumentPF2e | null
    > extends Combatant<TParent, TTokenDocument> {
        flags: CombatantFlags;
    }

    interface CombatantFlags extends DocumentFlags {
        pf2e: {
            initiativeStatistic: SkillSlug | "perception" | null;
            roundOfLastTurn: number | null;
            roundOfLastTurnEnd: number | null;
            overridePriority: Record<number, number | null | undefined>;
        };
    }
}
