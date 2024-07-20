function getDropTarget(
    _canvas: Canvas,
    data: DropCanvasData,
    filter?: (token: TokenPF2e) => boolean
) {
    return [...canvas.tokens.placeables]
        .sort((a, b) => b.document.sort - a.document.sort)
        .sort((a, b) => b.document.elevation - a.document.elevation)
        .find((t) => (!filter || filter(t)) && t.bounds.contains(data.x, data.y));
}

export { getDropTarget };
