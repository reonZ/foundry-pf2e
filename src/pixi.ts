function multiply(original: PIXI.Point, other: CalcPoint) {
    return calcWith(
        original,
        other,
        (x, o) => x * o,
        (y, o) => y * o
    );
}

function divide(original: PIXI.Point, other: CalcPoint) {
    return calcWith(
        original,
        other,
        (x, o) => x / o,
        (y, o) => y / o
    );
}

function add(original: PIXI.Point, other: CalcPoint) {
    return calcWith(
        original,
        other,
        (x, o) => x + o,
        (y, o) => y + o
    );
}

function substract(original: PIXI.Point, other: CalcPoint) {
    return calcWith(
        original,
        other,
        (x, o) => x - o,
        (y, o) => y - o
    );
}

function calcWith(original: PIXI.Point, other: CalcPoint, fnX: CalcFunction, fnY: CalcFunction) {
    const point = setOther(other);
    const result = new PIXI.Point();

    result.x = fnX?.(original.x, point.x) ?? original.x;
    result.y = fnY?.(original.y, point.y) ?? original.y;

    return result;
}

function setOther(other: CalcPoint) {
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

type CalcPoint = { x: number; y?: number } | { x?: number; y: number } | number;
type CalcFunction = (originalX: number, otherX: number) => number;

export { pixi };
