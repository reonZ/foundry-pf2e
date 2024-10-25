export {};

declare global {
    type WeaponPropertyRuneType = string;
    type WeaponCategory = "unarmed" | "simple" | "martial" | "advanced";
    type MeleeWeaponGroup =
        | "shield"
        | "axe"
        | "brawling"
        | "club"
        | "dart"
        | "flail"
        | "hammer"
        | "knife"
        | "pick"
        | "polearm"
        | "spear"
        | "sword";
    type WeaponGroup =
        | "shield"
        | "axe"
        | "bomb"
        | "bow"
        | "brawling"
        | "club"
        | "crossbow"
        | "dart"
        | "firearm"
        | "flail"
        | "hammer"
        | "knife"
        | "pick"
        | "polearm"
        | "sling"
        | "spear"
        | "sword";
    type BaseWeaponType = string;
    type WeaponTrait = string;
    type OtherWeaponTag = "improvised" | "shoddy" | "handwraps-of-mighty-blows";
    type WeaponRangeIncrement =
        | 20
        | 40
        | 10
        | 30
        | 50
        | 15
        | 100
        | 240
        | 200
        | 300
        | 60
        | 80
        | 70
        | 90
        | 110
        | 120
        | 140
        | 150
        | 180;
    type WeaponReloadTime = "-" | "0" | "1" | "2" | "3" | "10";
    type StrikingRuneType = "striking" | "greaterStriking" | "majorStriking";

    type WeaponMaterialType = Exclude<PreciousMaterialType, "dragonhide" | "grisantian-pelt">;

    type WeaponSource = BasePhysicalItemSource<"weapon", WeaponSystemSource> & {
        flags: DeepPartial<WeaponFlags>;
    };

    type WeaponFlags = ItemFlagsPF2e & {
        pf2e: {
            /** Whether this attack is compatible with a battle form */
            battleForm?: boolean;
            /** Whether the weapon is a combination weapon in its melee form */
            comboMeleeUsage: boolean;
            /**
             * Used for NPC attacks generated from strike rule elements: if numeric, it will be used as the NPC attack's
             * modifier, and damage will also not be recalculated.
             */
            fixedAttack?: number | null;
            /** A logging of this weapon's attack item bonus, whatever the source (rune, bomb innate item bonus, etc.) */
            attackItemBonus: number;
            /** A tracking property of whether the damage die size has been upgraded */
            damageFacesUpgraded: boolean;
        };
    };

    type WeaponUsage =
        | "worngloves"
        | "held-in-one-hand"
        | "held-in-one-plus-hands"
        | "held-in-two-hands";

    interface WeaponSystemSource extends Investable<PhysicalSystemSource> {
        traits: WeaponTraitsSource;
        material: WeaponMaterialSource;
        category: WeaponCategory;
        group: WeaponGroup | null;
        /** A base shield type can be used for attacks generated from shields */
        baseItem: BaseWeaponType | null;
        bonus: {
            value: number;
        };
        damage: WeaponDamage;
        bonusDamage: {
            value: number;
        };
        splashDamage: {
            value: number;
        };
        range: WeaponRangeIncrement | null;
        maxRange?: number | null;
        reload: {
            value: WeaponReloadTime | null;
        };
        usage: {
            canBeAmmo?: boolean;
            value: WeaponUsage;
        };
        runes: WeaponRuneSource;
        /** An optional override of the default ability modifier used in attack rolls with this weapon  */
        attribute?: AttributeString | null;
        /** A combination weapon's melee usage */
        meleeUsage?: ComboWeaponMeleeUsage;
        /** Whether the weapon is a "specific magic weapon" */
        specific: SpecificWeaponData | null;

        /** Whether this is an unarmed attack that is a grasping appendage, requiring a free hand for use */
        graspingAppendage?: boolean;

        /** Doubly-embedded adjustments, attachments, talismans etc. */
        subitems: PhysicalItemSource[];

        // Refers to custom damage, *not* property runes
        property1: {
            value: string;
            dice: number;
            die: DamageDieSize;
            damageType: DamageType | "";
            critDice: number;
            critDie: DamageDieSize;
            critDamage: string;
            critDamageType: DamageType | "";
        };
        selectedAmmoId: string | null;
    }

    interface WeaponTraitsSource extends PhysicalItemTraits<WeaponTrait> {
        otherTags: OtherWeaponTag[];
        toggles?: {
            doubleBarrel?: { selected: boolean };
            modular?: { selected: DamageType | null };
            versatile?: { selected: DamageType | null };
        };
    }

    interface WeaponDamage {
        /** The number of dice */
        dice: number;
        /** The die size (d4-d12) */
        die: DamageDieSize | null;
        damageType: DamageType;
        modifier: number;
        /** Optional persistent damage */
        persistent: WeaponPersistentDamage | null;
    }

    interface WeaponPersistentDamage {
        /** A number of dice if `faces` is numeric, otherwise a constant */
        number: number;
        /** A number of die faces */
        faces: 4 | 6 | 8 | 10 | 12 | null;
        /** Usually the same as the weapon's own base damage type, but open for the user to change */
        type: DamageType;
    }

    /** A weapon can either be unspecific or specific along with baseline material and runes */
    type SpecificWeaponData = {
        material: WeaponMaterialSource;
        runes: WeaponRuneSource;
    };

    interface WeaponMaterialSource extends ItemMaterialSource {
        type: WeaponMaterialType | null;
    }

    type WeaponRuneSource = {
        potency: ZeroToFour;
        striking: ZeroToThree;
        property: WeaponPropertyRuneType[];
    };

    interface WeaponSystemData
        extends Omit<
                WeaponSystemSource,
                "apex" | "bulk" | "description" | "hp" | "identification" | "price" | "temporary"
            >,
            Omit<Investable<PhysicalSystemData>, "material" | "subitems"> {
        traits: WeaponTraits;
        baseItem: BaseWeaponType | null;
        material: WeaponMaterialData;
        maxRange: number | null;
        reload: {
            value: WeaponReloadTime | null;
            /** Whether the ammunition (or the weapon itself, if thrown) should be consumed upon firing */
            consume: boolean | null;
            /** A display label for use in any view */
            label: string | null;
        };
        runes: WeaponRuneData;
        usage: WeaponUsageDetails;
        graspingAppendage: boolean;
        meleeUsage?: Required<ComboWeaponMeleeUsage>;
        stackGroup: null;
    }

    interface ToggleDoubleBarrelParams {
        trait: "double-barrel";
        selected: boolean;
    }

    interface ToggleModularVersatileParams {
        trait: "modular" | "versatile";
        selected: DamageType | null;
    }

    type ToggleWeaponTraitParams = ToggleDoubleBarrelParams | ToggleModularVersatileParams;

    type WeaponUsageDetails = UsageDetails & Required<WeaponSystemSource["usage"]>;

    class WeaponTraitToggles {
        get actor(): ActorPF2e | null;
        get doubleBarrel(): { selected: boolean };
        get modular(): { options: DamageType[]; selected: DamageType | null };
        get versatile(): { options: DamageType[]; selected: DamageType | null };

        update(options: ToggleWeaponTraitParams): Promise<boolean>;
    }

    interface WeaponTraits extends WeaponTraitsSource {
        otherTags: OtherWeaponTag[];
        toggles: WeaponTraitToggles;
    }

    interface WeaponMaterialData extends ItemMaterialData {
        type: WeaponMaterialType | null;
    }

    interface WeaponRuneData extends WeaponRuneSource {
        effects: WeaponPropertyRuneType[];
    }

    interface ComboWeaponMeleeUsage {
        damage: { type: DamageType; die: DamageDieSize };
        group: MeleeWeaponGroup;
        traits?: WeaponTrait[];
        traitToggles?: { modular: DamageType | null; versatile: DamageType | null };
    }

    class WeaponPF2e<
        TParent extends ActorPF2e | null = ActorPF2e | null
    > extends PhysicalItemPF2e<TParent> {
        get baseType(): BaseWeaponType | null;
        get group(): WeaponGroup | null;
        get category(): WeaponCategory;
        get defaultAttribute(): AttributeString;
        get hands(): "0" | "1" | "1+" | "2";
        get maxRange(): number | null;
        get range(): RangeData | null;
        get reload(): WeaponReloadTime | null;
        get isSpecific(): boolean;
        get isMelee(): boolean;
        get isRanged(): boolean;
        get isThrown(): boolean;
        get isThrowable(): boolean;
        get isOversized(): boolean;
        get baseDamage(): WeaponDamage;
        get dealsDamage(): boolean;
        get ammoRequired(): number;
        get ammo(): ConsumablePF2e<ActorPF2e> | WeaponPF2e<ActorPF2e> | null;
        get otherTags(): Set<OtherWeaponTag>;
    }

    interface WeaponPF2e<TParent extends ActorPF2e | null = ActorPF2e | null>
        extends PhysicalItemPF2e<TParent> {
        flags: WeaponFlags;
        readonly _source: WeaponSource;
        system: WeaponSystemData;

        get traits(): Set<WeaponTrait>;
    }
}
