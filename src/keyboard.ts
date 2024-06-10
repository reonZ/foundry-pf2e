function isHoldingModifierKeys(keys: ModifierKey[]) {
    return keys.some((key) => game.keyboard.isModifierActive(key));
}

export { isHoldingModifierKeys };
