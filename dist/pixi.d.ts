declare function multiply(original: PIXI.Point, other: CalcPoint): import("pixi.js").Point;
declare function divide(original: PIXI.Point, other: CalcPoint): import("pixi.js").Point;
declare function add(original: PIXI.Point, other: CalcPoint): import("pixi.js").Point;
declare function substract(original: PIXI.Point, other: CalcPoint): import("pixi.js").Point;
declare const pixi: {
    multiply: typeof multiply;
    divide: typeof divide;
    add: typeof add;
    substract: typeof substract;
};
type CalcPoint = {
    x: number;
    y?: number;
} | {
    x?: number;
    y: number;
} | number;
export { pixi };
