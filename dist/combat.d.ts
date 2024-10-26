declare function hasRolledInitiative(combatant: CombatantPF2e): combatant is RolledCombatant;
declare function rollInitiative(actor: ActorPF2e, statistic?: string, event?: Event): Promise<InitiativeRollResult | null> | undefined;
export { hasRolledInitiative, rollInitiative };
