"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderItemSheets = exports.renderCharacterSheets = exports.renderActorSheets = exports.refreshApplicationHeight = void 0;
const object_1 = require("./object");
function renderApplication(type) {
    const types = Array.isArray(type) ? type : [type];
    const apps = Object.values(ui.windows).filter((app) => types.some((x) => (0, object_1.isInstanceOf)(app, x)));
    for (const app of apps) {
        app.render();
    }
}
function renderCharacterSheets() {
    renderApplication("CharacterSheetPF2e");
}
exports.renderCharacterSheets = renderCharacterSheets;
function renderActorSheets(type) {
    renderApplication(type);
}
exports.renderActorSheets = renderActorSheets;
function renderItemSheets(type = ["ItemSheetPF2e"]) {
    renderApplication(type);
}
exports.renderItemSheets = renderItemSheets;
function refreshApplicationHeight(app) {
    if (!app)
        return;
    app.setPosition({ height: "auto" });
}
exports.refreshApplicationHeight = refreshApplicationHeight;
