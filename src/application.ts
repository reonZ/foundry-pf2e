import { isInstanceOf } from "./utils";

function renderApplication(type: string | string[]) {
    const types = Array.isArray(type) ? type : [type];
    const apps = Object.values(ui.windows).filter((app) => types.some((x) => isInstanceOf(app, x)));

    for (const app of apps) {
        app.render();
    }
}

function renderCharacterSheets() {
    renderApplication(["CharacterSheetPF2e"]);
}

export { renderCharacterSheets };
