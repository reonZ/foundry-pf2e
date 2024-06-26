declare const DAMAGE_TYPE_ICONS: Record<DamageType, string | null>;
declare function damageDiceIcon(roll: DamageRoll | DamageInstance, { fixedWidth }?: {
    fixedWidth?: boolean | undefined;
}): HTMLElement;
export { DAMAGE_TYPE_ICONS, damageDiceIcon };
