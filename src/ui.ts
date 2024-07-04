function toggleControlTool(name: string, active: boolean) {
    const toggle = ui.controls.control?.tools.find((t) => t.name === name);
    if (toggle?.toggle) {
        toggle.active = active;
        ui.controls.render();
    }
}

export { toggleControlTool };
