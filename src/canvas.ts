function getDropTarget(
    _canvas: Canvas,
    data: DropCanvasData,
    filter?: (token: TokenPF2e) => boolean
) {
    return [...canvas.tokens.placeables]
        .sort((a, b) => b.document.sort - a.document.sort)
        .find((token) => {
            if (filter && !filter(token)) return false;

            const maximumX = token.x + (token.hitArea?.right ?? 0);
            const maximumY = token.y + (token.hitArea?.bottom ?? 0);

            return (
                data.x >= token.x && data.y >= token.y && data.x <= maximumX && data.y <= maximumY
            );
        });
}

export { getDropTarget };
