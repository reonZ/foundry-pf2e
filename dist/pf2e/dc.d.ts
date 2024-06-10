declare function adjustDCByRarity(dc: number, rarity?: Rarity): number;
declare function calculateDC(level: number, { pwol, rarity }?: DCOptions): number;
interface DCOptions {
    pwol?: boolean;
    rarity?: Rarity;
}
export type { DCOptions };
export { calculateDC, adjustDCByRarity };
