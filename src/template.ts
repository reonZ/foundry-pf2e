function getTemplateTokens(
    measuredTemplate: MeasuredTemplateDocumentPF2e | MeasuredTemplatePF2e,
    {
        collisionOrigin,
        collisionType = "move",
    }: { collisionOrigin?: PIXI.Point; collisionType?: "move" } = {}
) {
    const grid = canvas.interface.grid;
    const dimensions = canvas.dimensions;
    const template =
        measuredTemplate instanceof MeasuredTemplateDocument
            ? measuredTemplate.object
            : measuredTemplate;
    if (!canvas.scene || !template?.highlightId || !grid || !dimensions) return [];

    const gridHighlight = grid.getHighlightLayer(template.highlightId);
    if (!gridHighlight || canvas.grid.type !== CONST.GRID_TYPES.SQUARE) return [];

    const gridSize = canvas.grid.size;
    const containedTokens: TokenPF2e[] = [];
    const origin = collisionOrigin ?? template.center;
    const tokens = canvas.tokens.quadtree.getObjects(
        gridHighlight.getLocalBounds(undefined, true)
    ) as Set<TokenPF2e>;

    for (const token of tokens) {
        const tokenDoc = token.document;
        const tokenPositions = [];

        for (let h = 0; h < tokenDoc.height; h++) {
            const tokenX = Math.floor(token.x / gridSize) * gridSize;
            const tokenY = Math.floor(token.y / gridSize) * gridSize;
            const y = tokenY + h * gridSize;

            tokenPositions.push(`${tokenX},${y}`);

            if (tokenDoc.width > 1) {
                for (let w = 1; w < tokenDoc.width; w++) {
                    tokenPositions.push(`${tokenX + w * gridSize},${y}`);
                }
            }
        }

        for (const position of tokenPositions) {
            if (!gridHighlight.positions.has(position)) {
                continue;
            }

            const [gx, gy] = position.split(",").map((s) => Number(s));
            const destination = {
                x: gx + dimensions.size * 0.5,
                y: gy + dimensions.size * 0.5,
            };
            if (destination.x < 0 || destination.y < 0) continue;

            const hasCollision = CONFIG.Canvas.polygonBackends[collisionType].testCollision(
                origin,
                destination,
                {
                    type: collisionType,
                    mode: "any",
                }
            );

            if (!hasCollision) {
                containedTokens.push(token);
                break;
            }
        }
    }

    return containedTokens;
}

export { getTemplateTokens };
