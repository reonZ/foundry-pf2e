/** Create a localization function with a prefixed localization object path */
declare function localizer(prefix: string): (...args: Parameters<Localization["format"]>) => string;
/**
 * Return an integer string of a number, always with sign (+/-)
 * @param value The number to convert to a string
 * @param options.emptyStringZero If the value is zero, return an empty string
 * @param options.zeroIsNegative Treat zero as a negative value
 */
declare function signedInteger(value: number, { emptyStringZero, zeroIsNegative }?: {
    emptyStringZero?: boolean | undefined;
    zeroIsNegative?: boolean | undefined;
}): string;
declare function ErrorPF2e(message: string): Error;
declare function getActionGlyph(action: string | number | null | ActionCost): string;
declare function getActionIcon(action: string | number | ActionCost | null, fallback: ImageFilePath): ImageFilePath;
declare function getActionIcon(action: string | number | ActionCost | null, fallback: ImageFilePath | null): ImageFilePath | null;
declare function getActionIcon(actionType: string | number | ActionCost | null): ImageFilePath;
declare function objectHasKey<O extends object>(obj: O, key: unknown): key is keyof O;
declare function ordinalString(value: number): string;
declare function setHasElement<T extends Set<unknown>>(set: T, value: unknown): value is SetElement<T>;
declare function tupleHasValue<const A extends readonly unknown[]>(array: A, value: unknown): value is A[number];
declare function fontAwesomeIcon(glyph: string, { style, fixedWidth }?: {
    style?: FontAwesomeStyle;
    fixedWidth?: boolean;
}): HTMLElement;
/**
 * Split and sanitize a list in string form. The empty string is always excluded from the resulting array.
 * @param [options.delimiter] The delimiter by which to split (default of ",")
 * @param [options.unique]    Whether to ensure the uniqueness of the resulting array's elements (default of true)
 */
declare function splitListString(str: string, { delimiter, unique }?: SplitListStringOptions): string[];
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
export { ErrorPF2e, fontAwesomeIcon, getActionGlyph, getActionIcon, localizer, signedInteger, splitListString, objectHasKey, ordinalString, setHasElement, tupleHasValue, };
