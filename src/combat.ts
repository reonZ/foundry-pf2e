function hasRolledInitiative(combatant: CombatantPF2e): combatant is RolledCombatant {
    return typeof combatant.initiative === "number";
}

export { hasRolledInitiative };
