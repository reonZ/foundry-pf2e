export {};

declare global {
    type UserVisibility = "none" | "all" | "owner" | "gm";

    type UserSourcePF2e = Omit<foundry.documents.UserSource, "flags"> & {
        flags: DeepPartial<UserFlagsPF2e>;
    };

    interface UserSettingsPF2e {
        showEffectPanel: boolean;
        showCheckDialogs: boolean;
        showDamageDialogs: boolean;
        monochromeDarkvision: boolean;
        searchPackContents: boolean;
    }

    type UserFlagsPF2e = DocumentFlags & {
        pf2e: {
            settings: UserSettingsPF2e;
        };
    };

    class UserPF2e extends User<ActorPF2e<null>> {
        get settings(): Readonly<UserSettingsPF2e>;

        getActiveTokens(): TokenDocumentPF2e[];
    }

    interface UserPF2e extends User<ActorPF2e<null>> {
        targets: Set<TokenPF2e<TokenDocumentPF2e<ScenePF2e>>> & { ids: string[] };
        flags: UserFlagsPF2e;
        readonly _source: UserSourcePF2e;
    }
}
