"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderCharacterSheets = void 0;
const utils_1 = require("./utils");
function renderApplication(type) {
    const types = Array.isArray(type) ? type : [type];
    const apps = Object.values(ui.windows).filter((app) => types.some((x) => (0, utils_1.isInstanceOf)(app, x)));
    for (const app of apps) {
        app.render();
    }
}
function renderCharacterSheets() {
    renderApplication(["CharacterSheetPF2e"]);
}
exports.renderCharacterSheets = renderCharacterSheets;
