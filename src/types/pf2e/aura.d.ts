export {};

declare global {
    interface TokenAuraData {
        /** The radius of the aura, measured in feet from the boundary of a token's space */
        radius: number;
        /** The token from which this aura is emanating */
        token: TokenPF2e | TokenDocumentPF2e;
        /** The rectangle defining this aura's space */
        bounds: PIXI.Rectangle;
        /** The pixel-coordinate radius of this aura, measured from the center */
        radiusPixels: number;
        appearance: AuraAppearanceData;
        /** Traits (especially "visual" and "auditory") associated with this aura */
        traits: ItemTrait[];
    }

    interface TokenAura extends TokenAuraData {
        slug: string;
        token: TokenDocumentPF2e;
        level: number | null;
        effects: AuraEffectData[];

        get scene(): ScenePF2e;

        notifyActors(): Promise<void>;
        containsToken(token: TokenDocumentPF2e): boolean;
    }
}
