export {};

declare global {
    interface MoveLootOptions extends FormApplicationOptions {
        targetActor?: ActorPF2e;
        newStack: boolean;
        lockStack: boolean;
        isPurchase: boolean;
    }

    interface MoveLootFormData {
        quantity: number;
        newStack: boolean;
        isPurchase: boolean;
    }

    interface PopupData extends FormApplicationData {
        item: PhysicalItemPF2e;
        quantity: number;
        canGift: boolean;
        newStack: boolean;
        lockStack: boolean;
        prompt: string;
    }

    class ItemTransferDialog extends FormApplication<PhysicalItemPF2e, MoveLootOptions> {
        get item(): PhysicalItemPF2e;

        protected _updateObject(event: Event, formData: Record<string, unknown>): Promise<unknown>;
    }
}
