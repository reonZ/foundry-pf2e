"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayIncludesOne = void 0;
function arrayIncludesOne(array, other) {
    return other.some((value) => array.includes(value));
}
exports.arrayIncludesOne = arrayIncludesOne;
