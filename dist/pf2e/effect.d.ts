declare function calculateRemainingDuration(effect: AbstractEffectPF2e, durationData: DurationData | {
    unit: "unlimited";
}, fightyActor?: ActorPF2e | null): {
    expired: boolean;
    remaining: number;
};
export { calculateRemainingDuration };
