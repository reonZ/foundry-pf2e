declare function getDamageRollClass(): typeof DamageRoll;
declare function getSpellCollectionClass<TParent extends CreaturePF2e>(actor: TParent): typeof SpellCollection<TParent>;
declare function getSpellClass(): typeof SpellPF2e;
declare function getStatisticClass(statistic: Statistic): typeof Statistic;
export { getDamageRollClass, getSpellClass, getSpellCollectionClass, getStatisticClass };
