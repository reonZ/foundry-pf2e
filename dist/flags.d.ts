import { MODULE } from "./module";
declare function getFlag<T>(doc: foundry.abstract.Document, ...path: string[]): T | undefined;
declare function setFlag(doc: foundry.abstract.Document, ...args: [...string[], any]): Promise<foundry.abstract.Document<foundry.abstract._Document | null, foundry.data.fields.DataSchema>>;
declare function unsetFlag(doc: foundry.abstract.Document, ...path: string[]): Promise<foundry.abstract.Document<foundry.abstract._Document | null, foundry.data.fields.DataSchema> | undefined>;
declare function flagPath(...path: string[]): `flags.${typeof MODULE.id}.${string}`;
declare function getFlagProperty<T>(obj: object, ...path: string[]): T | undefined;
declare function setFlagProperty<T extends object>(obj: T, ...args: [...string[], any]): T;
declare function usetFlagProperty<T extends object>(obj: T, ...path: string[]): T;
declare function updateFlag<T extends Record<string, unknown>>(doc: foundry.abstract.Document, updates: Partial<Record<keyof T, T[keyof T]>> & {
    [k: string]: any;
}): Promise<foundry.abstract.Document<foundry.abstract._Document | null, foundry.data.fields.DataSchema> | undefined>;
declare function getModuleFlag<T extends Record<string, unknown>>(doc: foundry.abstract.Document): T | undefined;
declare function hasModuleFlag<T extends Record<string, unknown>>(doc: foundry.abstract.Document): boolean;
declare function unsetMofuleFlag(doc: foundry.abstract.Document): Promise<foundry.abstract.Document<foundry.abstract._Document | null, foundry.data.fields.DataSchema> | undefined>;
declare function updateSourceFlag(doc: foundry.abstract.Document, ...args: [...string[], any]): DeepPartial<SourceFromSchema<foundry.data.fields.DataSchema>>;
export { flagPath, getFlag, getFlagProperty, getModuleFlag, hasModuleFlag, setFlag, setFlagProperty, unsetFlag, updateFlag, updateSourceFlag, usetFlagProperty, unsetMofuleFlag, };
