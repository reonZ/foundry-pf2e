export {};

declare global {
    type DropCanvasItemDataPF2e = DropCanvasData<"Item", ItemPF2e> & {
        value?: number;
        level?: number;
        spellFrom?: {
            collectionId: string;
            groupId: string;
            slotIndex: number;
        };
        context?: EffectContextData;
    };

    type DropCanvasPersistentDamage = DropCanvasData<"PersistentDamage"> & {
        formula: string;
    };

    type DropCanvasDataPF2e = DropCanvasItemDataPF2e | DropCanvasPersistentDamage;

    class LightingLayerPF2e<
        TAmbientLight extends AmbientLightPF2e = AmbientLightPF2e
    > extends LightingLayer<TAmbientLight> {
        get lightingLevel(): number;
    }

    class AmbientLightPF2e<
        TDocument extends AmbientLightDocumentPF2e = AmbientLightDocumentPF2e
    > extends AmbientLight<TDocument> {
        // Still exists if we need it later, but slated for removal once V12 is fully out
    }

    interface AmbientLightPF2e<
        TDocument extends AmbientLightDocumentPF2e = AmbientLightDocumentPF2e
    > extends AmbientLight<TDocument> {
        get layer(): LightingLayerPF2e<this>;
    }
}
