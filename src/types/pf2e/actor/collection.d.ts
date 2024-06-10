export {};

declare global {
    class ActorsPF2e<TActor extends ActorPF2e<null>> extends Actors<TActor> {}
}
