import * as R from "remeda";

const actionGlyphMap: Record<string, string> = {
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

const actionImgMap: Record<string, ImageFilePath> = {
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
function localizer(prefix: string): (...args: Parameters<Localization["format"]>) => string {
    return (...[suffix, formatArgs]: Parameters<Localization["format"]>) =>
        formatArgs
            ? game.i18n.format(`${prefix}.${suffix}`, formatArgs)
            : game.i18n.localize(`${prefix}.${suffix}`);
}

let intlNumberFormat: Intl.NumberFormat;
/**
 * Return an integer string of a number, always with sign (+/-)
 * @param value The number to convert to a string
 * @param options.emptyStringZero If the value is zero, return an empty string
 * @param options.zeroIsNegative Treat zero as a negative value
 */
function signedInteger(
    value: number,
    { emptyStringZero = false, zeroIsNegative = false } = {}
): string {
    if (value === 0 && emptyStringZero) return "";
    const nf = (intlNumberFormat ??= new Intl.NumberFormat(game.i18n.lang, {
        maximumFractionDigits: 0,
        signDisplay: "always",
    }));
    const maybeNegativeZero = zeroIsNegative && value === 0 ? -0 : value;

    return nf.format(maybeNegativeZero);
}

function ErrorPF2e(message: string): Error {
    return Error(`PF2e System | ${message}`);
}

function getActionGlyph(action: string | number | null | ActionCost): string {
    if (!action && action !== 0) return "";

    const value =
        typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();

    return actionGlyphMap[sanitized]?.replace("-", "–") ?? "";
}

function getActionIcon(
    action: string | number | ActionCost | null,
    fallback: ImageFilePath
): ImageFilePath;
function getActionIcon(
    action: string | number | ActionCost | null,
    fallback: ImageFilePath | null
): ImageFilePath | null;
function getActionIcon(actionType: string | number | ActionCost | null): ImageFilePath;
function getActionIcon(
    action: string | number | ActionCost | null,
    fallback: ImageFilePath | null = "systems/pf2e/icons/actions/Empty.webp"
): ImageFilePath | null {
    if (action === null) return actionImgMap.passive;
    const value =
        typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();
    return actionImgMap[sanitized] ?? fallback;
}

function objectHasKey<O extends object>(obj: O, key: unknown): key is keyof O {
    return (typeof key === "string" || typeof key === "number") && key in obj;
}

function ordinalString(value: number): string {
    const pluralRules = new Intl.PluralRules(game.i18n.lang, { type: "ordinal" });
    const suffix = game.i18n.localize(`PF2E.OrdinalSuffixes.${pluralRules.select(value)}`);
    return game.i18n.format("PF2E.OrdinalNumber", { value, suffix });
}

function setHasElement<T extends Set<unknown>>(set: T, value: unknown): value is SetElement<T> {
    return set.has(value);
}

function tupleHasValue<const A extends readonly unknown[]>(
    array: A,
    value: unknown
): value is A[number] {
    return array.includes(value);
}

function fontAwesomeIcon(
    glyph: string,
    { style = "solid", fixedWidth = false }: { style?: FontAwesomeStyle; fixedWidth?: boolean } = {}
): HTMLElement {
    const styleClass = `fa-${style}`;
    const glyphClass = glyph.startsWith("fa-") ? glyph : `fa-${glyph}`;
    const icon = document.createElement("i");
    icon.classList.add(styleClass, glyphClass);
    if (fixedWidth) icon.classList.add("fa-fw");

    return icon;
}

/**
 * Split and sanitize a list in string form. The empty string is always excluded from the resulting array.
 * @param [options.delimiter] The delimiter by which to split (default of ",")
 * @param [options.unique]    Whether to ensure the uniqueness of the resulting array's elements (default of true)
 */
function splitListString(
    str: string,
    { delimiter = ",", unique = true }: SplitListStringOptions = {}
): string[] {
    const list = str
        .split(delimiter)
        .map((el) => el.trim())
        .filter((el) => el !== "");
    return unique ? R.unique(list) : list;
}

/** Generate and return an HTML element for a FontAwesome icon */
type FontAwesomeStyle = "solid" | "regular" | "duotone";

interface ActionCost {
    type: Exclude<ActionType, "passive">;
    value: OneToThree | null;
}

interface SplitListStringOptions {
    delimiter?: string | RegExp;
    unique?: boolean;
}

export {
    ErrorPF2e,
    fontAwesomeIcon,
    getActionGlyph,
    getActionIcon,
    localizer,
    signedInteger,
    splitListString,
    objectHasKey,
    ordinalString,
    setHasElement,
    tupleHasValue,
};
