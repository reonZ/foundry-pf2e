export {};

type ConfiguredConfig = Config<
    AmbientLightDocument<ScenePF2e | null>,
    ActiveEffect<ActorPF2e | ItemPF2e | null>,
    ActorPF2e,
    ActorDeltaPF2e<TokenDocumentPF2e>,
    ChatLogPF2e,
    ChatMessagePF2e,
    EncounterPF2e,
    CombatantPF2e<EncounterPF2e | null, TokenDocumentPF2e>,
    EncounterTrackerPF2e<EncounterPF2e | null>,
    CompendiumDirectory,
    Hotbar,
    ItemPF2e,
    MacroPF2e,
    MeasuredTemplateDocumentPF2e,
    RegionDocument<ScenePF2e | null>,
    RegionBehaviorPF2e<RegionDocument<ScenePF2e | null>>,
    TileDocumentPF2e,
    TokenDocumentPF2e,
    WallDocument<ScenePF2e | null>,
    ScenePF2e,
    UserPF2e,
    EffectsCanvasGroupPF2e
>;

type ConfigRecord<T extends string> = Record<T, string>;

declare global {
    interface ConfigPF2e extends ConfiguredConfig {
        debug: ConfiguredConfig["debug"] & {
            ruleElement: boolean;
        };
        time: {
            roundTime: number;
        };
        PF2E: {
            chatDamageButtonShieldToggle: boolean;
            usages: ConfigRecord<string>;
            creatureTraits: ConfigRecord<CreatureTrait>;
            featTraits: ConfigRecord<FeatTrait>;
            effectTraits: ConfigRecord<EffectTrait>;
            saves: ConfigRecord<SaveType>;
            senseAcuities: ConfigRecord<SenseAcuity>;
            magicTraditions: ConfigRecord<MagicTradition>;
            spellTraits: ConfigRecord<SpellTrait>;
            featCategories: ConfigRecord<FeatOrFeatureCategory>;
            actorSizes: ConfigRecord<Size>;
            abilities: ConfigRecord<AttributeString>;
            resistanceTypes: ConfigRecord<ResistanceType>;
            elementTraits: ConfigRecord<ElementTrait>;
            damageTypes: ConfigRecord<DamageType>;
            actionTraits: ConfigRecord<string>;
            traitsDescriptions: ConfigRecord<string>;
            languages: ConfigRecord<Language>;
            weaponTraits: ConfigRecord<WeaponTrait>;
            skills: Record<SkillSlug, { label: string; attribute: AttributeString }>;
            rarityTraits: ConfigRecord<Rarity>;
            weaponGroups: ConfigRecord<WeaponGroup>;
            preciousMaterials: ConfigRecord<PreciousMaterialType>;
            environmentTypes: {
                aquatic: "PF2E.Environment.Type.Aquatic";
                arctic: "PF2E.Environment.Type.Arctic";
                desert: "PF2E.Environment.Type.Desert";
                forest: "PF2E.Environment.Type.Forest";
                mountain: "PF2E.Environment.Type.Mountain";
                plains: "PF2E.Environment.Type.Plains";
                swamp: "PF2E.Environment.Type.Swamp";
                underground: "PF2E.Environment.Type.Underground";
                urban: "PF2E.Environment.Type.Urban";
            };
            actionsNumber: {
                1: "PF2E.ActionNumber1";
                2: "PF2E.ActionNumber2";
                3: "PF2E.ActionNumber3";
            };
            actionCategories: {
                interaction: "PF2E.Item.Action.Category.Interaction";
                defensive: "PF2E.Item.Action.Category.Defensive";
                offensive: "PF2E.Item.Action.Category.Offensive";
                familiar: "PF2E.Item.Action.Category.Familiar";
            };
            actionTypes: {
                action: "PF2E.ActionTypeAction";
                reaction: "PF2E.ActionTypeReaction";
                free: "PF2E.ActionTypeFree";
                passive: "PF2E.ActionTypePassive";
            };
            frequencies: {
                turn: "PF2E.Duration.turn";
                round: "PF2E.Duration.round";
                PT1M: "PF2E.Duration.PT1M";
                PT10M: "PF2E.Duration.PT10M";
                PT1H: "PF2E.Duration.PT1H";
                PT24H: "PF2E.Duration.PT24H";
                day: "PF2E.Duration.day";
                P1W: "PF2E.Duration.P1W";
                P1M: "PF2E.Duration.P1M";
                P1Y: "PF2E.Duration.P1Y";
            };
            pfsFactions: {
                EA: "PF2E.PFS.Factions.EA";
                GA: "PF2E.PFS.Factions.GA";
                HH: "PF2E.PFS.Factions.HH";
                VS: "PF2E.PFS.Factions.VS";
                RO: "PF2E.PFS.Factions.RO";
                VW: "PF2E.PFS.Factions.VW";
            };
            proficiencyLevels: [
                "PF2E.ProficiencyLevel0", // untrained
                "PF2E.ProficiencyLevel1", // trained
                "PF2E.ProficiencyLevel2", // expert
                "PF2E.ProficiencyLevel3", // master
                "PF2E.ProficiencyLevel4" // legendary
            ];
            preparationType: {
                prepared: "PF2E.PreparationTypePrepared";
                spontaneous: "PF2E.PreparationTypeSpontaneous";
                innate: "PF2E.PreparationTypeInnate";
                focus: "PF2E.TraitFocus";
                items: "PF2E.PreparationTypeItems";
                ritual: "PF2E.Item.Spell.Ritual.Label";
                charges: "Charges";
            };
            Actor: {
                documentClasses: {
                    army: typeof ArmyPF2e;
                    character: typeof CharacterPF2e;
                    npc: typeof NPCPF2e;
                    hazard: typeof HazardPF2e;
                    loot: typeof LootPF2e;
                    familiar: typeof FamiliarPF2e;
                    party: typeof PartyPF2e;
                    vehicle: typeof VehiclePF2e;
                };
            };
            Item: {
                documentClasses: {
                    action: typeof AbilityItemPF2e;
                    affliction: typeof AfflictionPF2e;
                    ancestry: typeof AncestryPF2e;
                    armor: typeof ArmorPF2e;
                    background: typeof BackgroundPF2e;
                    backpack: typeof ContainerPF2e;
                    book: typeof BookPF2e;
                    campaignFeature: typeof CampaignFeaturePF2e;
                    class: typeof ClassPF2e;
                    condition: typeof ConditionPF2e;
                    consumable: typeof ConsumablePF2e;
                    deity: typeof DeityPF2e;
                    effect: typeof EffectPF2e;
                    equipment: typeof EquipmentPF2e;
                    feat: typeof FeatPF2e;
                    heritage: typeof HeritagePF2e;
                    kit: typeof KitPF2e;
                    lore: typeof LorePF2e;
                    melee: typeof MeleePF2e;
                    shield: typeof ShieldPF2e;
                    spell: typeof SpellPF2e;
                    spellcastingEntry: typeof SpellcastingEntryPF2e;
                    treasure: typeof TreasurePF2e;
                    weapon: typeof WeaponPF2e;
                };
            };
            worldClock: {
                Date: string;
            };
        };
    }

    type ElementTrait = "fire" | "metal" | "water" | "wood" | "air" | "earth";
}
