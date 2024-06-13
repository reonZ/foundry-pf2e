"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("../module");
const misc_1 = require("./misc");
class ItemTransfer {
    #templatePaths = {
        flavor: "./systems/pf2e/templates/chat/action/flavor.hbs",
        content: "./systems/pf2e/templates/chat/action/content.hbs",
    };
    source;
    target;
    quantity;
    containerId;
    isPurchase;
    constructor(data) {
        this.source = data.source;
        this.target = data.target;
        this.quantity = data.quantity;
        this.containerId = data.containerId;
        this.isPurchase = data.isPurchase ?? null;
    }
    async request(socket) {
        const gamemaster = game.users.find((u) => u.isGM && u.active);
        if (!gamemaster) {
            const source = this.getSource();
            const target = this.getTarget();
            const loot = [source, target].find((a) => a?.isLootableBy(game.user) && !a.isOwner);
            if (!loot)
                throw (0, misc_1.ErrorPF2e)("Unexpected missing actor");
            ui.notifications.error(game.i18n.format("PF2E.loot.GMSupervisionError", {
                loot: ItemTransfer.#tokenName(loot),
            }));
            return;
        }
        console.debug(`${module_1.MODULE.name} | Requesting item transfer from GM ${gamemaster.name}`);
        socket.emit(this);
    }
    // Only a GM can call this method, or else Foundry will block it (or would if we didn't first)
    async enact(requester, messageData) {
        if (!game.user.isGM) {
            throw (0, misc_1.ErrorPF2e)("Unauthorized item transfer");
        }
        console.debug(`${module_1.MODULE.name} | Enacting item transfer`);
        const sourceActor = this.getSource();
        const sourceItem = sourceActor?.inventory.find((i) => i.id === this.source.itemId);
        const targetActor = this.getTarget();
        // Sanity checks
        if (!(sourceActor?.isLootableBy(game.user) &&
            sourceItem &&
            targetActor?.isLootableBy(game.user))) {
            throw (0, misc_1.ErrorPF2e)("Failed sanity check during item transfer");
        }
        const targetItem = await sourceActor.transferItemToActor(targetActor, sourceItem, this.quantity, this.containerId, false);
        const sourceIsLoot = sourceActor.isOfType("loot") && sourceActor.system.lootSheetType === "Loot";
        // A merchant transaction can fail if funds are insufficient, but a loot transfer failing is an error.
        if (!sourceItem && sourceIsLoot) {
            return;
        }
        if (messageData) {
            this.#sendMessage(requester, sourceActor, targetActor, targetItem, messageData);
        }
    }
    /** Retrieve the full actor from the source or target ID */
    #getActor(tokenId, actorId) {
        if (typeof tokenId === "string") {
            const token = canvas.tokens.placeables.find((t) => t.id === tokenId);
            return token?.actor ?? null;
        }
        return game.actors.get(actorId) ?? null;
    }
    getSource() {
        return this.#getActor(this.source.tokenId, this.source.actorId);
    }
    getTarget() {
        return this.#getActor(this.target.tokenId, this.target.actorId);
    }
    // Prefer token names over actor names
    static #tokenName(document) {
        if ("items" in document) {
            // Use a special moniker for party actors
            if (document.isOfType("party"))
                return game.i18n.localize("PF2E.loot.PartyStash");
            // Synthetic actor: use its token name or, failing that, actor name
            if (document.token)
                return document.token.name;
            // Linked actor: use its token prototype name
            return document.prototypeToken?.name ?? document.name;
        }
        // User with an assigned character
        if (document.character) {
            const token = canvas.tokens.placeables.find((t) => t.actor?.id === document.id);
            return token?.name ?? document.character?.name;
        }
        // User with no assigned character (should never happen)
        return document.name;
    }
    /** Send a chat message that varies on the types of transaction and parties involved
     * @param requester   The player who requested an item transfer to be performed by the GM
     * @param sourceActor The actor from which the item was dragged
     * @param targetActor The actor on which the item was dropped
     * @param item        The item created on the target actor as a result of the drag & drop
     */
    async #sendMessage(requester, sourceActor, targetActor, item, { subtitle, message }) {
        const localize = (0, misc_1.localizer)("PF2E.loot");
        if (!item) {
            if (this.isPurchase) {
                const message = localize("InsufficientFundsMessage");
                // The buyer didn't have enough funds! No transaction.
                const content = await renderTemplate(this.#templatePaths.content, {
                    imgPath: targetActor.img,
                    message: game.i18n.format(message, { buyer: targetActor.name }),
                });
                const flavor = await this.#messageFlavor(sourceActor, targetActor, localize("BuySubtitle"));
                await ChatMessage.create({
                    author: requester.id,
                    speaker: { alias: ItemTransfer.#tokenName(targetActor) },
                    style: CONST.CHAT_MESSAGE_STYLES.EMOTE,
                    flavor,
                    content,
                });
                return;
            }
            else {
                throw (0, misc_1.ErrorPF2e)("Unexpected item-transfer failure");
            }
        }
        const formatProperties = {
            giver: ItemTransfer.#tokenName(sourceActor),
            recipient: ItemTransfer.#tokenName(targetActor),
            quantity: this.quantity,
            item: await TextEditor.enrichHTML(item.link),
        };
        // Don't bother showing quantity if it's only 1:
        const content = await renderTemplate(this.#templatePaths.content, {
            imgPath: item.img,
            message: game.i18n.format(message, formatProperties).replace(/\b1 × /, ""),
        });
        const flavor = await this.#messageFlavor(sourceActor, targetActor, subtitle);
        await ChatMessage.create({
            author: requester.id,
            speaker: { alias: formatProperties.giver },
            style: CONST.CHAT_MESSAGE_STYLES.EMOTE,
            flavor,
            content,
        });
    }
    async #messageFlavor(sourceActor, targetActor, subtitle) {
        const glyph = (0, misc_1.getActionGlyph)(sourceActor.isOfType("loot") && targetActor.isOfType("loot") ? 2 : 1);
        const action = { title: "PF2E.Actions.Interact.Title", subtitle: subtitle, glyph };
        const traits = [
            {
                name: "manipulate",
                label: CONFIG.PF2E.featTraits.manipulate,
                description: CONFIG.PF2E.traitsDescriptions.manipulate,
            },
        ];
        return await renderTemplate(this.#templatePaths.flavor, { action, traits });
    }
}
