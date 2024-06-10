declare function getDamageRollClass(): typeof DamageRoll;
declare function getSpellCollectionClass<TParent extends CreaturePF2e>(actor: TParent): typeof SpellCollection<TParent>;
declare function getSpellClass(): typeof SpellPF2e;
export { getDamageRollClass, getSpellClass, getSpellCollectionClass };
