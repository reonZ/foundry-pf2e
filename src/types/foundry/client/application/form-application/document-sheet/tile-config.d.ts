/**
 * Tile Config Sheet
 * @todo fill this in
 */
declare class TileConfig<
    TDocument extends TileDocument<Scene | null>
> extends DocumentSheet<TDocument> {
    override _updateObject(event: Event, formData: Record<string, unknown>): Promise<void>;
}
