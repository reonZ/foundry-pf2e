export {};

declare global {
    abstract class IWR<TType extends IWRType> {}

    interface Immunity extends IWR<ImmunityType>, ImmunitySource {
        get label(): string;
    }

    interface Weakness extends IWR<WeaknessType>, WeaknessSource {
        get label(): string;
    }

    interface Resistance extends IWR<ResistanceType>, ResistanceSource {
        get label(): string;
    }
}
