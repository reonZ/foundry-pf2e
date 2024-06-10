export {};

declare global {
    class CoinsPF2e implements Coins {
        cp: number;
        sp: number;
        gp: number;
        pp: number;

        static fromString(coinString: string, quantity?: number): CoinsPF2e;
        static fromPrice(price: PartialPrice, factor: number): CoinsPF2e;

        get copperValue(): number;
        get goldValue(): number;

        plus(coins: Coins): CoinsPF2e;
        scale(factor: number): CoinsPF2e;
        adjustForSize(size: Size): CoinsPF2e;
        toObject(): Coins;
        toString(): string;
    }
}
