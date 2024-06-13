function getDamageRollClass() {
    return CONFIG.Dice.rolls.find((Roll) => Roll.name === "DamageRoll") as typeof DamageRoll;
}

function getSpellCollectionClass<TParent extends CreaturePF2e>(actor: TParent) {
    return actor.spellcasting.get("rituals")!.spells!
        .constructor as typeof SpellCollection<TParent>;
}

function getSpellClass() {
    return CONFIG.PF2E.Item.documentClasses.spell;
}

function getStatisticClass(statistic: Statistic) {
    return statistic.constructor as typeof Statistic;
}

export { getDamageRollClass, getSpellClass, getSpellCollectionClass, getStatisticClass };
