"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tupleHasValue = exports.setHasElement = exports.ordinalString = exports.objectHasKey = exports.signedInteger = exports.localizer = exports.getActionIcon = exports.getActionGlyph = exports.fontAwesomeIcon = exports.ErrorPF2e = void 0;
const actionGlyphMap = {
    0: "F",
    free: "F",
    1: "1",
    2: "2",
    3: "3",
    "1 or 2": "1/2",
    "1 to 3": "1 - 3",
    "2 or 3": "2/3",
    "2 rounds": "3,3",
    reaction: "R",
};
const actionImgMap = {
    0: "systems/pf2e/icons/actions/FreeAction.webp",
    free: "systems/pf2e/icons/actions/FreeAction.webp",
    1: "systems/pf2e/icons/actions/OneAction.webp",
    2: "systems/pf2e/icons/actions/TwoActions.webp",
    3: "systems/pf2e/icons/actions/ThreeActions.webp",
    "1 or 2": "systems/pf2e/icons/actions/OneTwoActions.webp",
    "1 to 3": "systems/pf2e/icons/actions/OneThreeActions.webp",
    "2 or 3": "systems/pf2e/icons/actions/TwoThreeActions.webp",
    reaction: "systems/pf2e/icons/actions/Reaction.webp",
    passive: "systems/pf2e/icons/actions/Passive.webp",
};
/** Create a localization function with a prefixed localization object path */
function localizer(prefix) {
    return (...[suffix, formatArgs]) => formatArgs
        ? game.i18n.format(`${prefix}.${suffix}`, formatArgs)
        : game.i18n.localize(`${prefix}.${suffix}`);
}
exports.localizer = localizer;
let intlNumberFormat;
/**
 * Return an integer string of a number, always with sign (+/-)
 * @param value The number to convert to a string
 * @param options.emptyStringZero If the value is zero, return an empty string
 * @param options.zeroIsNegative Treat zero as a negative value
 */
function signedInteger(value, { emptyStringZero = false, zeroIsNegative = false } = {}) {
    if (value === 0 && emptyStringZero)
        return "";
    const nf = (intlNumberFormat ??= new Intl.NumberFormat(game.i18n.lang, {
        maximumFractionDigits: 0,
        signDisplay: "always",
    }));
    const maybeNegativeZero = zeroIsNegative && value === 0 ? -0 : value;
    return nf.format(maybeNegativeZero);
}
exports.signedInteger = signedInteger;
function ErrorPF2e(message) {
    return Error(`PF2e System | ${message}`);
}
exports.ErrorPF2e = ErrorPF2e;
function getActionGlyph(action) {
    if (!action && action !== 0)
        return "";
    const value = typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();
    return actionGlyphMap[sanitized]?.replace("-", "–") ?? "";
}
exports.getActionGlyph = getActionGlyph;
function getActionIcon(action, fallback = "systems/pf2e/icons/actions/Empty.webp") {
    if (action === null)
        return actionImgMap.passive;
    const value = typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();
    return actionImgMap[sanitized] ?? fallback;
}
exports.getActionIcon = getActionIcon;
function objectHasKey(obj, key) {
    return (typeof key === "string" || typeof key === "number") && key in obj;
}
exports.objectHasKey = objectHasKey;
function ordinalString(value) {
    const pluralRules = new Intl.PluralRules(game.i18n.lang, { type: "ordinal" });
    const suffix = game.i18n.localize(`PF2E.OrdinalSuffixes.${pluralRules.select(value)}`);
    return game.i18n.format("PF2E.OrdinalNumber", { value, suffix });
}
exports.ordinalString = ordinalString;
function setHasElement(set, value) {
    return set.has(value);
}
exports.setHasElement = setHasElement;
function tupleHasValue(array, value) {
    return array.includes(value);
}
exports.tupleHasValue = tupleHasValue;
function fontAwesomeIcon(glyph, { style = "solid", fixedWidth = false } = {}) {
    const styleClass = `fa-${style}`;
    const glyphClass = glyph.startsWith("fa-") ? glyph : `fa-${glyph}`;
    const icon = document.createElement("i");
    icon.classList.add(styleClass, glyphClass);
    if (fixedWidth)
        icon.classList.add("fa-fw");
    return icon;
}
exports.fontAwesomeIcon = fontAwesomeIcon;
