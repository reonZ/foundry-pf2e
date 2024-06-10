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
exports.stringNumber = exports.stringBoolean = exports.safeSplit = exports.rollDie = exports.joinStr = exports.isInstanceOf = exports.beautity = void 0;
const R = __importStar(require("remeda"));
function joinStr(separator, ...path) {
    return R.pipe(path, R.flat(), R.filter((x) => typeof x === "string"), R.join(separator));
}
exports.joinStr = joinStr;
function safeSplit(str, selector = ",") {
    return str
        .split(selector)
        .map((s) => s.trim())
        .filter(Boolean);
}
exports.safeSplit = safeSplit;
function beautity(str) {
    return str.replaceAll(/[-_.]([a-z])/g, (_, c) => ` ${c.toUpperCase()}`).capitalize();
}
exports.beautity = beautity;
function stringBoolean(b) {
    return String(b);
}
exports.stringBoolean = stringBoolean;
function stringNumber(n) {
    return String(n);
}
exports.stringNumber = stringNumber;
function isInstanceOf(obj, cls) {
    if (typeof obj !== "object" || obj === null)
        return false;
    let cursor = Reflect.getPrototypeOf(obj);
    while (cursor) {
        if (cursor.constructor.name === cls)
            return true;
        cursor = Reflect.getPrototypeOf(cursor);
    }
    return false;
}
exports.isInstanceOf = isInstanceOf;
function rollDie(faces, nb = 1) {
    let total = 0;
    for (let i = 0; i < nb; i++) {
        total += Math.floor(Math.random() * faces) + 1;
    }
    return total;
}
exports.rollDie = rollDie;
