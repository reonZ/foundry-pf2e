declare function settingPath(...path: string[]): `${string}.${string}`;
declare function getSetting<T = boolean>(key: string): T;
declare function setSetting(key: string, value: any): Promise<unknown>;
declare function registerSetting(options: SettingOptions): void;
declare function registerSettingMenu(options: MenuSettingOptions): void;
export { getSetting, registerSettingMenu, registerSetting, setSetting, settingPath };
