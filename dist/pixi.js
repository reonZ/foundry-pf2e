"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pixi = void 0;
function multiply(original, other) {
    return calcWith(original, other, (x, o) => x * o, (y, o) => y * o);
}
function divide(original, other) {
    return calcWith(original, other, (x, o) => x / o, (y, o) => y / o);
}
function add(original, other) {
    return calcWith(original, other, (x, o) => x + o, (y, o) => y + o);
}
function substract(original, other) {
    return calcWith(original, other, (x, o) => x - o, (y, o) => y - o);
}
function calcWith(original, other, fnX, fnY) {
    const point = setOther(other);
    const result = new PIXI.Point();
    result.x = fnX?.(original.x, point.x) ?? original.x;
    result.y = fnY?.(original.y, point.y) ?? original.y;
    return result;
}
function setOther(other) {
    if (typeof other === "number") {
        other = { x: other, y: other };
    }
    return {
        x: other.x ?? 1,
        y: other.y ?? 1,
    };
}
const pixi = {
    multiply,
    divide,
    add,
    substract,
};
exports.pixi = pixi;
