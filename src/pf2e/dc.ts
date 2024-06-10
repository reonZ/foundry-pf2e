const dcAdjustments = new Map<DCAdjustment, number>([
    ["incredibly-easy", -10],
    ["very-easy", -5],
    ["easy", -2],
    ["normal", 0],
    ["hard", 2],
    ["very-hard", 5],
    ["incredibly-hard", 10],
]);

const dcByLevel = new Map([
    [-1, 13],
    [0, 14],
    [1, 15],
    [2, 16],
    [3, 18],
    [4, 19],
    [5, 20],
    [6, 22],
    [7, 23],
    [8, 24],
    [9, 26],
    [10, 27],
    [11, 28],
    [12, 30],
    [13, 31],
    [14, 32],
    [15, 34],
    [16, 35],
    [17, 36],
    [18, 38],
    [19, 39],
    [20, 40],
    [21, 42],
    [22, 44],
    [23, 46],
    [24, 48],
    [25, 50],
]);

function rarityToDCAdjustment(rarity: Rarity = "common"): PositiveDCAdjustment {
    switch (rarity) {
        case "uncommon":
            return "hard";
        case "rare":
            return "very-hard";
        case "unique":
            return "incredibly-hard";
        default:
            return "normal";
    }
}

function adjustDC(dc: number, adjustment: DCAdjustment = "normal"): number {
    return dc + (dcAdjustments.get(adjustment) ?? 0);
}

function adjustDCByRarity(dc: number, rarity: Rarity = "common"): number {
    return adjustDC(dc, rarityToDCAdjustment(rarity));
}

function calculateDC(level: number, { pwol, rarity = "common" }: DCOptions = {}): number {
    pwol ??= game.pf2e.settings.variants.pwol.enabled;

    // assume level 0 if garbage comes in. We cast level to number because the backing data may actually have it
    // stored as a string, which we can't catch at compile time
    const dc = dcByLevel.get(level) ?? 14;
    if (pwol) {
        // -1 shouldn't be subtracted since it's just
        // a creature level and not related to PC levels
        return adjustDCByRarity(dc - Math.max(level, 0), rarity);
    } else {
        return adjustDCByRarity(dc, rarity);
    }
}

interface DCOptions {
    pwol?: boolean;
    rarity?: Rarity;
}

export type { DCOptions };
export { calculateDC, adjustDCByRarity };
