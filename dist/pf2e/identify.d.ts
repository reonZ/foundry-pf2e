/// <reference types="jquery" />
/// <reference types="jquery" />
/// <reference types="tooltipster" />
import { type DCOptions } from "./dc";
declare function getItemIdentificationDCs(item: PhysicalItemPF2e, { pwol, notMatchingTraditionModifier }: IdentifyItemOptions): GenericIdentifyDCs | IdentifyMagicDCs | IdentifyAlchemyDCs;
declare class IdentifyItemPopup extends FormApplication<PhysicalItemPF2e> {
    static get defaultOptions(): FormApplicationOptions;
    dcs: IdentifyMagicDCs | GenericIdentifyDCs | IdentifyAlchemyDCs;
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
interface IdentifyPopupData extends FormApplicationData {
    isMagic: boolean;
    isAlchemical: boolean;
    dcs: GenericIdentifyDCs | IdentifyMagicDCs | IdentifyAlchemyDCs;
}
export { IdentifyItemPopup, getItemIdentificationDCs };
