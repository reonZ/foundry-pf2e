import { RollNotePF2e } from "./notes";
declare function extractNotes(rollNotes: Record<string, RollNotePF2e[]>, selectors: string[]): RollNotePF2e[];
declare function extractEphemeralEffects({ affects, origin, target, item, domains, options, }: ExtractEphemeralEffectsParams): Promise<(ConditionSource | EffectSource)[]>;
interface ExtractEphemeralEffectsParams {
    affects: "target" | "origin";
    origin: ActorPF2e | null;
    target: ActorPF2e | null;
    item: ItemPF2e | null;
    domains: string[];
    options: Set<string> | string[];
}
export { extractEphemeralEffects, extractNotes };
