declare function prepareTradeData<TData extends TradeData>(source: ActorPF2e, target: ActorPF2e, item: PhysicalItemPF2e, data: TData): TradePacket<TData>;
declare function translateTradeData<TData extends TradeData>(data: TradePacket<TData>): TranslatedTradeData<TData>;
declare function sendTradeRequest<TData extends TradeData>(source: ActorPF2e, target: ActorPF2e, item: PhysicalItemPF2e, data: TData, socket: {
    emit: (packet: TradePacket<TData>) => void;
}): void;
declare function enactTradeRequest<TData extends TradeData>(data: TranslatedTradeData<TData>): Promise<EnactedTradeData<TData> | null>;
declare function createTradeMessage({ quantity, sourceActor, targetActor, newItem }: EnactedTradeData, { message, subtitle }: {
    subtitle: string;
    message: string;
}, senderId: string): Promise<void>;
type EnactedTradeData<TData extends TradeData = TradeData> = TranslatedTradeData<TData> & {
    newItem: PhysicalItemPF2e;
};
type TranslatedTradeData<TData extends TradeData> = TData & {
    sourceItem: PhysicalItemPF2e<ActorPF2e>;
    sourceActor: ActorPF2e;
    targetActor: ActorPF2e;
    quantity: number;
};
type TradeSources = {
    source: {
        tokenId?: string;
        actorId: string;
        itemId: string;
    };
    target: {
        tokenId?: string;
        actorId: string;
    };
};
type TradeData = {
    quantity: number;
    containerId?: string;
};
type TradePacket<TData extends TradeData = TradeData> = TradeSources & TData;
export type { TradeData, TradePacket, TranslatedTradeData };
export { createTradeMessage, enactTradeRequest, prepareTradeData, sendTradeRequest, translateTradeData, };
