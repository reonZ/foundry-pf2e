import { isInstanceOf } from "./object";

function renderApplication(type: string | string[]) {
    const types = Array.isArray(type) ? type : [type];
    const apps = Object.values(ui.windows).filter((app) => types.some((x) => isInstanceOf(app, x)));

    for (const app of apps) {
        app.render();
    }
}

function renderCharacterSheets() {
    renderApplication("CharacterSheetPF2e");
}

function renderActorSheets(type: ActorSheetType) {
    renderApplication(type);
}

function renderItemSheets(type: ItemSheetType | ItemSheetType[] = ["ItemSheetPF2e"]) {
    renderApplication(type);
}

function refreshApplicationHeight(app: Maybe<Application>) {
    if (!app) return;
    app.setPosition({ height: "auto" });
}

type ActorSheetType = "CharacterSheetPF2e" | "LootSheetPF2e";
type ItemSheetType = "AbilitySheetPF2e" | "FeatSheetPF2e" | "ItemSheetPF2e";

export { refreshApplicationHeight, renderActorSheets, renderCharacterSheets, renderItemSheets };
