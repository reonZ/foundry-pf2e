export {};

declare global {
    class ActorsPF2e<TActor extends ActorPF2e<null>> extends Actors<TActor> {
        get party(): PartyPF2e<null> | null;
    }
}
