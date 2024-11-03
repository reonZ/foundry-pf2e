"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringNumber = exports.stringBoolean = exports.removeIndexFromArray = exports.joinStr = exports.getUuidFromInlineMatch = exports.compareArrays = exports.arrayIncludes = void 0;
const R = __importStar(require("remeda"));
function joinStr(separator, ...path) {
    return R.pipe(path, R.flat(), R.filter((x) => typeof x === "string"), R.join(separator));
}
exports.joinStr = joinStr;
function stringBoolean(b) {
    return String(b);
}
exports.stringBoolean = stringBoolean;
function stringNumber(n) {
    return String(n);
}
exports.stringNumber = stringNumber;
function compareArrays(arr1, arr2, unique = false) {
    arr1 = unique ? R.filter(arr1, R.isTruthy) : arr1;
    arr2 = unique ? R.filter(arr2, R.isTruthy) : arr2.slice();
    if (arr1.length !== arr2.length)
        return false;
    for (const value1 of arr1) {
        const index = arr2.findIndex((value2) => value1 === value2);
        if (index === -1)
            return false;
        arr2.splice(index, 1);
    }
    return true;
}
exports.compareArrays = compareArrays;
function arrayIncludes(array, other) {
    return other.some((value) => array.includes(value));
}
exports.arrayIncludes = arrayIncludes;
function getUuidFromInlineMatch(match) {
    return match[1] === "Compendium" ? `Compendium.${match[2]}` : match[2];
}
exports.getUuidFromInlineMatch = getUuidFromInlineMatch;
function removeIndexFromArray(array, index, copy = true) {
    const usedArray = (copy ? array.slice() : array);
    if (index < 0 || index >= array.length)
        return usedArray;
    usedArray.splice(index, 1);
    return usedArray;
}
exports.removeIndexFromArray = removeIndexFromArray;
