"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleControlTool = void 0;
function toggleControlTool(name, active) {
    const toggle = ui.controls.control?.tools.find((t) => t.name === name);
    if (toggle?.toggle) {
        toggle.active = active;
        ui.controls.render();
    }
}
exports.toggleControlTool = toggleControlTool;
