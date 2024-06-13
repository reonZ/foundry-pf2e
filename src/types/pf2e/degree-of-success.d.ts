export {};

declare global {
    interface CheckDC {
        slug?: string | null;
        statistic?: StatisticDifficultyClass | null;
        label?: string;
        scope?: "attack" | "check";
        value: number;
        visible?: boolean;
    }

    interface DegreeOfSuccessAdjustment {
        adjustments: DegreeAdjustmentsRecord;
        predicate?: Predicate;
    }

    type DegreeAdjustmentAmount =
        | 1
        | 2
        | -1
        | -2
        | "criticalFailure"
        | "failure"
        | "success"
        | "criticalSuccess";

    type DegreeOfSuccessString = "criticalFailure" | "failure" | "success" | "criticalSuccess";

    type DegreeAdjustmentsRecord = {
        [key in "all" | DegreeOfSuccessString]?: { label: string; amount: DegreeAdjustmentAmount };
    };

    type RollBrief = { dieValue: number; modifier: number };

    interface DegreeOfSuccessAdjustment {
        adjustments: DegreeAdjustmentsRecord;
        predicate?: Predicate;
    }

    interface CheckDC {
        slug?: string | null;
        statistic?: StatisticDifficultyClass | null;
        label?: string;
        scope?: "attack" | "check";
        value: number;
        visible?: boolean;
    }

    type DegreeOfSuccessIndex = ZeroToThree;
}
