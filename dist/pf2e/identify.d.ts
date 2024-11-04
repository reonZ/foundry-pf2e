/// <reference types="jquery" />
/// <reference types="jquery" />
/// <reference types="tooltipster" />
import { type DCOptions } from "./dc";
/**
 * small modification to always default to:
 * - pwol: game.pf2e.settings.variants.pwol.enabled
 * - notMatchingTraditionModifier: game.settings.get("pf2e", "identifyMagicNotMatchingTraditionModifier")
 */
declare function getItemIdentificationDCs(item: PhysicalItemPF2e, { pwol, notMatchingTraditionModifier, }?: Partial<IdentifyItemOptions>): ItemIdentifyDCs;
declare class IdentifyItemPopup extends FormApplication<PhysicalItemPF2e> {
    static get defaultOptions(): FormApplicationOptions;
    dcs: ItemIdentifyDCs;
    getData(): Promise<IdentifyPopupData>;
    activateListeners($html: JQuery): void;
    requestChecks(): Promise<void>;
    _updateObject(_event: Event, formData: Record<string, unknown>): Promise<void>;
}
interface IdentifyItemOptions extends DCOptions {
    notMatchingTraditionModifier: number;
}
type MagicSkill = Extract<SkillSlug, "arcana" | "nature" | "religion" | "occultism">;
type IdentifyMagicDCs = Record<MagicSkill, number>;
type IdentifyAlchemyDCs = {
    crafting: number;
};
type GenericIdentifyDCs = {
    dc: number;
};
type ItemIdentifyDCs = GenericIdentifyDCs | IdentifyMagicDCs | IdentifyAlchemyDCs;
interface IdentifyPopupData extends FormApplicationData {
    isMagic: boolean;
    isAlchemical: boolean;
    dcs: ItemIdentifyDCs;
}
export type { ItemIdentifyDCs };
export { IdentifyItemPopup, getItemIdentificationDCs };
