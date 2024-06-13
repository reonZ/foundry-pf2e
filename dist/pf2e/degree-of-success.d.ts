declare const DEGREE_OF_SUCCESS_STRINGS: readonly ["criticalFailure", "failure", "success", "criticalSuccess"];
declare const DEGREE_OF_SUCCESS: {
    readonly CRITICAL_SUCCESS: 3;
    readonly SUCCESS: 2;
    readonly FAILURE: 1;
    readonly CRITICAL_FAILURE: 0;
};
/** Get the degree of success from a roll and a difficulty class */
declare class DegreeOfSuccess {
    #private;
    /** The calculated degree of success */
    readonly value: DegreeOfSuccessIndex;
    /** The degree of success prior to adjustment. If there was no adjustment, it is identical to the `value` */
    readonly unadjusted: DegreeOfSuccessIndex;
    /** A degree adjustment, usually from some character ability */
    readonly adjustment: {
        label: string;
        amount: DegreeAdjustmentAmount;
    } | null;
    /** The result of a d20 roll */
    readonly dieResult: number;
    /** The total of a roll, including the die result and total modifier */
    readonly rollTotal: number;
    /** The check DC being rolled against */
    readonly dc: CheckDC;
    constructor(roll: Rolled<CheckRoll> | RollBrief, dc: CheckDC | number, dosAdjustments?: DegreeAdjustmentsRecord | null);
    static readonly CRITICAL_FAILURE = 0;
    static readonly FAILURE = 1;
    static readonly SUCCESS = 2;
    static readonly CRITICAL_SUCCESS = 3;
}
export { DEGREE_OF_SUCCESS, DEGREE_OF_SUCCESS_STRINGS, DegreeOfSuccess };
