/**
 * A game settings configuration application
 * This form renders the settings defined via the game.settings.register API which have config = true
 *
 */
declare class SettingsConfig extends FormApplication {
    // @TODO: Declare

    override _updateObject(event: Event, formData: {}): Promise<void>;
}

type SettingsConfigCategory = {
    id: string;
    title: string;
    menus: SettingSubmenuConfig[];
    settings: Required<SettingConfig & { id: string }>[];
    count: number;
};

declare interface SettingsConfigData {
    categoryTemplate: string;
    submitButton: boolean;
    total: number;
    canConfigure: boolean;
    user: User;
    categories: SettingsConfigCategory[];
}
