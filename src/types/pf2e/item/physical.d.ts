export {};

declare global {
    type BaseMaterialType =
        | "bone"
        | "cloth"
        | "glass"
        | "leather"
        | "paper"
        | "rope"
        | "steel"
        | "stone"
        | "wood";
    type BaseMaterialThickness = "thin" | "standard" | "structure";
    type BaseMaterial = { type: BaseMaterialType; thickness: BaseMaterialThickness };

    type CoinDenomination = "pp" | "gp" | "sp" | "cp";

    type PhysicalItemTrait = string;
    type PhysicalItemType =
        | "armor"
        | "book"
        | "consumable"
        | "backpack"
        | "equipment"
        | "shield"
        | "treasure"
        | "weapon";

    type PreciousMaterialType =
        | "abysium"
        | "adamantine"
        | "dawnsilver"
        | "djezet"
        | "duskwood"
        | "inubrix"
        | "noqual"
        | "orichalcum"
        | "siccatite"
        | "silver"
        | "cold-iron"
        | "dragonhide"
        | "grisantian-pelt"
        | "keep-stone"
        | "peachwood"
        | "sisterstone"
        | "sisterstone-dusk"
        | "sisterstone-scarlet"
        | "sovereign-steel"
        | "warpglass";
    type PreciousMaterialGrade = "low" | "standard" | "high";

    type BasePhysicalItemSource<
        TType extends PhysicalItemType,
        TSystemSource extends PhysicalSystemSource = PhysicalSystemSource
    > = BaseItemSourcePF2e<TType, TSystemSource>;

    interface PhysicalItemTraits<T extends PhysicalItemTrait> extends TraitsWithRarity<T> {
        otherTags: string[];
    }

    interface PhysicalItemHPSource {
        value: number;
        max: number;
    }

    interface PhysicalItemHitPoints extends PhysicalItemHPSource {
        brokenThreshold: number;
    }

    type Coins = {
        pp?: number;
        gp?: number;
        sp?: number;
        cp?: number;
    };

    interface PartialPrice {
        value: Coins;
        per?: number;
    }

    interface Price extends PartialPrice {
        value: CoinsPF2e;
        per: number;
    }

    type ItemCarryType = "attached" | "dropped" | "held" | "stowed" | "worn";

    type EquippedData = {
        carryType: ItemCarryType;
        inSlot?: boolean;
        handsHeld?: ZeroToTwo;
        invested?: boolean | null;
    };

    interface PhysicalSystemSource extends ItemSystemSource {
        level: { value: number };
        traits: PhysicalItemTraits<PhysicalItemTrait>;
        quantity: number;
        baseItem: string | null;
        bulk: {
            value: number;
        };
        hp: PhysicalItemHPSource;
        hardness: number;
        price: PartialPrice;
        equipped: EquippedData;
        identification: IdentificationSource;
        containerId: string | null;
        material: ItemMaterialSource;
        size: Size;
        usage?: { value: string };
        activations?: Record<string, ItemActivation>;
        temporary?: boolean;
        subitems?: PhysicalItemSource[];

        /**
         * Data for apex items: the attribute upgraded and, in case of multiple apex items, whether the upgrade has been
         * selected
         */
        apex?: {
            attribute: AttributeString;
            selected?: boolean;
        };
    }

    interface ItemActivation {
        id: string;
        description: {
            value: string;
        };
        actionCost: ActionCost;
        components: {
            command: boolean;
            envision: boolean;
            interact: boolean;
            cast: boolean;
        };
        frequency?: Frequency;
        traits: ValuesList<ActionTrait>;
    }

    type IdentificationStatus = "identified" | "unidentified";

    interface MystifiedData {
        name: string;
        img: ImageFilePath;
        data: {
            description: {
                value: string;
            };
        };
    }

    interface IdentificationSource {
        status: IdentificationStatus;
        unidentified: MystifiedData;
        misidentified: object;
    }

    interface ItemMaterialSource {
        grade: PreciousMaterialGrade | null;
        type: PreciousMaterialType | null;
    }

    type Investable<TData extends PhysicalSystemData | PhysicalSystemSource> = TData & {
        equipped: {
            invested: boolean | null;
        };
    };

    /** The item's bulk in Light bulk units, given the item is of medium size */
    interface BulkData {
        /** Held or stowed bulk */
        heldOrStowed: number;
        /** The applicable bulk value between the above two */
        value: number;
        /** The quantity of this item necessary to amount to the above bulk quantities: anything less is negligible */
        per: number;
    }

    interface ItemMaterialData extends ItemMaterialSource {
        effects: MaterialDamageEffect[];
    }

    type IdentifiedData = DeepPartial<MystifiedData>;

    interface IdentificationData extends IdentificationSource {
        identified: MystifiedData;
    }

    interface HeldUsage {
        value: string;
        type: "held";
        where?: never;
        hands: 1 | 2;
    }

    interface WornUsage {
        value: string;
        type: "worn";
        where?: string | null;
        hands?: 0;
    }

    interface AttachedUsage {
        value: string;
        type: "attached";
        where: string;
        hands?: 0;
    }

    interface CarriedUsage {
        value: "carried";
        type: "carried";
        where?: never;
        hands?: 0;
    }

    type UsageDetails = HeldUsage | WornUsage | AttachedUsage | CarriedUsage;

    interface PhysicalSystemData
        extends Omit<PhysicalSystemSource, "description">,
            Omit<ItemSystemData, "level"> {
        apex?: {
            attribute: AttributeString;
            selected: boolean;
        };
        hp: PhysicalItemHitPoints;
        price: Price;
        bulk: BulkData;
        material: ItemMaterialData;
        traits: PhysicalItemTraits<PhysicalItemTrait>;
        temporary: boolean;
        identification: IdentificationData;
        usage: UsageDetails;
        stackGroup: string | null;
    }

    type CoinsField = foundry.data.fields.SchemaField<
        CoinsSchema,
        SourceFromSchema<CoinsSchema>,
        CoinsPF2e,
        true,
        false,
        true
    >;

    type CoinsSchema = {
        cp: foundry.data.fields.NumberField<number, number, false, false, false>;
        sp: foundry.data.fields.NumberField<number, number, false, false, false>;
        gp: foundry.data.fields.NumberField<number, number, false, false, false>;
        pp: foundry.data.fields.NumberField<number, number, false, false, false>;
    };

    type PriceSchema = {
        value: CoinsField;
        per: foundry.data.fields.NumberField<number, number, true, false, true>;
    };

    class PriceField extends foundry.data.fields.SchemaField<PriceSchema> {}

    class Bulk {
        value: number;

        get normal(): number;
        get light(): number;
        get isNegligible(): boolean;
        get isLight(): boolean;

        toLightUnits(): number;
        increment(): Bulk;
        plus(other: number | Bulk): Bulk;
        minus(other: number | Bulk): Bulk;
        times(factor: number): Bulk;
        toString(): string;
        double(): Bulk;
        halve(): Bulk;
        convertToSize(itemSize: Size, actorSize: Size): Bulk;
    }

    abstract class PhysicalItemPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends ItemPF2e<TParent> {
        parentItem: PhysicalItemPF2e | null;
        subitems: Collection<PhysicalItemPF2e<TParent>>;

        get isEquipped(): boolean;
        get level(): number;
        get rarity(): Rarity;
        get traits(): Set<PhysicalItemTrait>;
        get quantity(): number;
        get size(): Size;
        get hitPoints(): PhysicalItemHitPoints;
        get hardness(): number;
        get carryType(): ItemCarryType;
        get isHeld(): boolean;
        get handsHeld(): ZeroToTwo;
        get isWorn(): boolean;
        get isAttachable(): boolean;
        get price(): Price;
        get assetValue(): CoinsPF2e;
        get identificationStatus(): IdentificationStatus;
        get isIdentified(): boolean;
        get isAlchemical(): boolean;
        get isMagical(): boolean;
        get isInvested(): boolean | null;
        get isCursed(): boolean;
        get isTemporary(): boolean;
        get isShoddy(): boolean;
        get isDamaged(): boolean;
        get isBroken(): boolean;
        get isDestroyed(): boolean;
        get material(): ItemMaterialData;
        get isSpecific(): boolean;
        get isInContainer(): boolean;
        get isStowed(): boolean;
        get container(): ContainerPF2e<ActorPF2e> | null;
        get bulk(): Bulk;
        get activations(): (ItemActivation & { componentsLabel: string })[];

        setIdentificationStatus(status: IdentificationStatus): Promise<void>;
    }

    interface PhysicalItemPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ItemPF2e<TParent> {
        readonly _source: PhysicalItemSource;
        system: PhysicalSystemData;
    }
}
