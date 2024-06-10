export {};

declare global {
    type SpellCategory = "cantrip" | "focus" | "ritual" | "spell";
    type MagicTradition = "arcane" | "divine" | "occult" | "primal";
    type SpellTrait = string;
    type EffectAreaShape = "burst" | "cone" | "cube" | "cylinder" | "emanation" | "line" | "square";

    type SpellSource = BaseItemSourcePF2e<"spell", SpellSystemSource>;

    interface SpellSystemSource extends ItemSystemSource {
        traits: SpellTraits;
        level: { value: OneToTen };
        requirements: string;
        target: {
            value: string;
        };
        range: {
            value: string;
        };
        area: SpellArea | null;
        time: {
            value: string;
        };
        duration: {
            value: string;
            sustained: boolean;
        };
        damage: Record<string, SpellDamageSource>;
        heightening?: SpellHeighteningFixed | SpellHeighteningInterval;
        overlays?: Record<string, SpellOverlay>;
        defense: SpellDefenseSource | null;
        cost: {
            value: string;
        };
        counteraction: boolean;
        ritual: RitualData | null;
        location: {
            value: string | null;
            signature?: boolean;
            heightenedLevel?: OneToTen;

            /** The level to heighten this spell to if it's a cantrip or focus spell */
            autoHeightenLevel?: OneToTen | null;

            /** Number of uses if this is an innate spell */
            uses?: ValueAndMax;
        };
        source?: { value: string };
    }

    interface SpellTraits extends ItemTraits<SpellTrait> {
        traditions: MagicTradition[];
    }

    interface SpellArea {
        type: EffectAreaShape;
        value: number;
        /**
         * Legacy text information about spell effect areas:
         * if present, includes information not representable in a structured way
         */
        details?: string;
    }

    interface SpellDamageSource {
        formula: string;
        kinds?: DamageKind[];
        applyMod?: boolean;
        type: DamageType;
        category: DamageCategoryUnique | null;
        materials: MaterialDamageEffect[];
    }

    interface SpellDefenseSource {
        passive: { statistic: SpellPassiveDefense } | null;
        save: { statistic: SaveType; basic: boolean } | null;
    }

    type SpellPassiveDefense = "ac" | `${SaveType}-dc`;

    interface SpellHeighteningInterval {
        type: "interval";
        interval: number;
        damage: Record<string, string>;
    }

    interface SpellHeighteningFixed {
        type: "fixed";
        levels: { [K in OneToTen]?: Partial<SpellSystemSource> };
    }

    interface SpellHeightenLayer {
        level: number;
        system: Partial<SpellSystemSource>;
    }

    interface SpellOverlayOverride {
        system?: DeepPartial<SpellSystemSource>;
        name?: string;
        overlayType: "override";
        sort: number;
    }

    interface SpellSystemData
        extends Omit<SpellSystemSource, "damage" | "description">,
            Omit<ItemSystemData, "level" | "traits"> {
        /** Time and resources consumed in the casting of this spell */
        cast: SpellCastData;
        damage: Record<string, SpellDamage>;
        defense: SpellDefenseData | null;
    }

    interface SpellCastData {
        focusPoints: ZeroToThree;
    }

    interface SpellDamage extends Omit<SpellDamageSource, "kinds"> {
        kinds: Set<DamageKind>;
    }

    interface SpellDefenseData extends SpellDefenseSource {
        passive: { statistic: SpellPassiveDefense } | null;
    }

    type SpellOverlay = SpellOverlayOverride;
    type SpellOverlayType = SpellOverlay["overlayType"];

    interface RitualData {
        /** Details of the primary check for the ritual */
        primary: { check: string };
        /** Details of the secondary check(s) for the ritual and maximum number of casters */
        secondary: { checks: string; casters: number };
    }

    interface SpellToMessageOptions {
        create?: boolean;
        rollMode?: RollMode;
        data?: { castRank?: number };
    }

    class SpellOverlayCollection extends Collection<SpellOverlay> {}

    class SpellPF2e<TParent extends ActorPF2e | null = ActorPF2e | null> extends ItemPF2e<TParent> {
        readonly parentItem: ConsumablePF2e<TParent> | null;
        /** The original spell. Only exists if this is a variant */
        declare original?: SpellPF2e<TParent>;
        /** The overlays that were applied to create this variant */
        declare appliedOverlays?: Map<SpellOverlayType, string>;
        declare overlays: SpellOverlayCollection;

        get variantId(): string | null;
        get baseRank(): OneToTen;
        get baseLevel(): OneToTen;
        get rank(): OneToTen;
        get level(): number;
        get traits(): Set<SpellTrait>;
        get rarity(): Rarity;
        get traditions(): Set<MagicTradition>;
        get actionGlyph(): string | null;
        get defense(): { slug: string; label: string } | null;
        get spellcasting(): BaseSpellcastingEntry<NonNullable<TParent>> | null;
        get isAttack(): boolean;
        get isCantrip(): boolean;
        get isFocusSpell(): boolean;
        get isRitual(): boolean;
        get attribute(): AttributeString;
        get atWill(): boolean;
        get isVariant(): boolean;
        get hasVariants(): boolean;
        get range(): RangeData | null;
        get isMelee(): boolean;
        get isRanged(): boolean;
        get area(): (SpellArea & { label: string }) | null;
        get damageKinds(): Set<DamageKind>;

        getRollOptions(
            prefix?: string,
            options?: { includeGranter?: boolean; includeVariants?: boolean }
        ): string[];
    }

    interface SpellPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends ItemPF2e<TParent> {
        readonly _source: SpellSource;
        system: SpellSystemData;
    }
}
