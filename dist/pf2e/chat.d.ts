/** Toggle off the Shield Block button on a damage chat message */
declare function toggleOffShieldBlock(messageId: string): void;
declare function onClickShieldBlock(shieldButton: HTMLButtonElement, messageEl: HTMLElement, token?: TokenDocumentPF2e): void;
declare function applyDamageFromMessage({ message, multiplier, addend, promptModifier, rollIndex, tokens, onDamageApplied, }: ApplyDamageFromMessageParams): Promise<void>;
declare function selfApplyEffectFromMessage(message: ChatMessagePF2e, html: HTMLElement): Promise<void>;
type ApplyDamageFromMessageCallback = (message: ChatMessagePF2e, tokens: TokenDocumentPF2e[], rollIndex: number) => void;
interface ApplyDamageFromMessageParams {
    message: ChatMessagePF2e;
    multiplier?: number;
    addend?: number;
    promptModifier?: boolean;
    rollIndex?: number;
    tokens?: TokenDocumentPF2e[];
    onDamageApplied?: ApplyDamageFromMessageCallback;
}
export { applyDamageFromMessage, onClickShieldBlock, selfApplyEffectFromMessage, toggleOffShieldBlock, };
