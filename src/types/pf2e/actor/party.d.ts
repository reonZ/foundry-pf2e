export {};

declare global {
    type PartySource = BaseActorSourcePF2e<"party", PartySystemSource>;

    interface PartySystemSource extends ActorSystemSource {
        attributes: PartyAttributesSource;
        details: PartyDetailsSource;
        traits?: never;
        campaign?: PartyCampaignSource;
    }

    interface PartyAttributesSource extends ActorAttributesSource {
        hp?: never;
        ac?: never;
        immunities?: never;
        weaknesses?: never;
        resistances?: never;
    }

    interface PartyDetailsSource extends ActorDetailsSource {
        description: string;
        members: MemberData[];
        readonly alliance?: never;
        readonly level?: never;
    }

    interface MemberData {
        uuid: ActorUUID;
    }

    interface PartyUpdateOperation<TParent extends TokenDocumentPF2e | null>
        extends ActorUpdateOperation<TParent> {
        removedMembers?: string[];
    }

    /** Interface for a party campaign implementation, alternative data preparation used by parties for special campaigns */
    interface PartyCampaign extends foundry.abstract.DataModel<PartyPF2e, {}> {
        type: string;
        level?: number;
        /** Any additional item types supported by the campaign */
        extraItemTypes?: ItemType[];
        /** Sidebar buttons to inject into the party header */
        createSidebarButtons?(): HTMLElement[];
        /** Returns any additional statistics that should be returned by the party */
        getStatistic?(slug: string): Statistic | null;
        /** Additional campaign specific roll options for rule elements */
        getRollOptions?(): string[];
        /** Additional data for inline rolls */
        getRollData?(): Record<string, unknown>;
        /** Renders the sheet associateed with this campaign, if available */
        renderSheet?(options?: { tab?: string; type?: string | null }): void;
        /** Executed during the actor's prepareBaseData phase */
        prepareBaseData?(): void;
        /** Executed during the actor's prepareDerivedData phase */
        prepareDerivedData?(): void;
        _preUpdate?(changed: Record<string, unknown>): void;
    }

    interface PartySystemData
        extends Omit<PartySystemSource, "attributes" | "campaign" | "details">,
            Omit<ActorSystemData, "traits"> {
        attributes: PartyAttributes;
        details: PartyDetails;
        campaign: PartyCampaign;
    }

    interface PartyAttributes
        extends Omit<PartyAttributesSource, "immunities" | "weaknesses" | "resistances">,
            Omit<ActorAttributes, "initiative" | "ac" | "hp"> {
        immunities: never[];
        weaknesses: never[];
        resistances: never[];
        speed: { total: number };
    }

    interface PartyDetails extends Omit<PartyDetailsSource, "alliance" | "level">, ActorDetails {
        level: { value: number };
    }

    type PartyCampaignSource = { type: string } & Record<string, JSONValue>;

    class PartyPF2e<
        TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null
    > extends ActorPF2e<TParent> {
        members: CreaturePF2e[];
        campaign: PartyCampaign | null;
    }

    interface PartyPF2e<TParent extends TokenDocumentPF2e | null = TokenDocumentPF2e | null>
        extends ActorPF2e<TParent> {
        readonly _source: PartySource;
        system: PartySystemData;
    }
}
