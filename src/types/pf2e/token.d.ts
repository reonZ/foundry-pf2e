export {};

declare global {
    class TokenPF2e<
        TDocument extends TokenDocumentPF2e = TokenDocumentPF2e
    > extends Token<TDocument> {
        get isAnimating(): boolean;

        distanceTo(target: TokenPF2e, options?: { reach?: number | null }): number;
    }

    interface TokenPF2e<TDocument extends TokenDocumentPF2e = TokenDocumentPF2e>
        extends Token<TDocument> {
        get layer(): TokenLayer<this>;
    }
}
