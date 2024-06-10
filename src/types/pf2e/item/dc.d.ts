export {};

declare global {
    type NegativeDCAdjustment = "incredibly-easy" | "very-easy" | "easy" | "normal";

    type PositiveDCAdjustment = "normal" | "hard" | "very-hard" | "incredibly-hard";

    type DCAdjustment = NegativeDCAdjustment | PositiveDCAdjustment;
}
