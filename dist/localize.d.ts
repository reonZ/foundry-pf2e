import { MODULE } from "./module";
type NotificationData = Record<string, string | number | boolean>;
declare function warn(str: string, arg1?: NotificationData | boolean, arg2?: boolean): void;
declare function info(str: string, arg1?: NotificationData | boolean, arg2?: boolean): void;
declare function error(str: string, arg1?: NotificationData | boolean, arg2?: boolean): void;
declare function localize(...args: LocalizeArgs): string;
declare function templateLocalize(subKey: string): (key: string, { hash }: {
    hash: Record<string, string>;
}) => string;
declare function localeCompare(a: string, b: string): number;
declare function hasLocalization(...path: string[]): boolean;
declare function localizeIfExist(...args: LocalizeArgs): string | undefined;
declare function subLocalize(subKey: string): typeof localize & {
    ifExist: typeof localizeIfExist;
    has: typeof hasLocalization;
    path: typeof MODULE.path;
    warn: typeof warn;
    info: typeof info;
    error: typeof error;
    i18n: typeof templateLocalize;
    sub: typeof subLocalize;
};
type LocalizeArgs = [...string[], string | Record<string, any>];
export { error, hasLocalization, info, localeCompare, localize, localizeIfExist, subLocalize, templateLocalize, warn, };
