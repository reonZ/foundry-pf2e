"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDropTarget = void 0;
function getDropTarget(_canvas, data, filter) {
    return [...canvas.tokens.placeables]
        .sort((a, b) => b.document.sort - a.document.sort)
        .sort((a, b) => b.document.elevation - a.document.elevation)
        .find((t) => (!filter || filter(t)) && t.bounds.contains(data.x, data.y));
}
exports.getDropTarget = getDropTarget;
