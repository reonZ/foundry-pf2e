"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollNotePF2e = void 0;
const html_1 = require("../html");
class RollNotePF2e {
    /** The selector used to determine on which rolls the note will be shown for. */
    selector;
    /** An optional title for the note */
    title;
    /** The text content of this note. */
    text;
    /** If true, these dice are user-provided/custom. */
    predicate;
    /** List of outcomes to show this note for; or all outcomes if none are specified */
    outcome;
    /** An optional visibility restriction for the note */
    visibility;
    /** The originating rule element of this modifier, if any: used to retrieve "parent" item roll options */
    rule;
    constructor(params) {
        this.selector = params.selector;
        this.title = params.title ?? null;
        this.text = params.text;
        this.predicate = new game.pf2e.Predicate(params.predicate ?? []);
        this.outcome = [...(params.outcome ?? [])];
        this.visibility = params.visibility ?? null;
        this.rule = params.rule ?? null;
    }
    /** Convert an array of notes to a UL element, or null if the array is empty. */
    static notesToHTML(notes) {
        if (notes.length === 0)
            return null;
        return (0, html_1.createHTMLElement)("ul", {
            classes: ["notes"],
            children: [...notes.flatMap((n) => ["\n", n.toHTML()]), "\n"],
        });
    }
    toHTML() {
        const element = (0, html_1.createHTMLElement)("li", {
            classes: ["roll-note"],
            dataset: {
                itemId: this.rule?.item.id,
                visibility: this.visibility,
            },
            innerHTML: game.i18n.localize(this.text),
        });
        // Remove wrapping elements, such as from item descriptions
        if (element.childNodes.length === 1 && element.firstChild instanceof HTMLElement) {
            element.innerHTML = element.firstChild.innerHTML;
        }
        if (this.title) {
            const strong = (0, html_1.createHTMLElement)("strong", {
                innerHTML: game.i18n.localize(this.title),
            });
            element.prepend(strong, " ");
        }
        return element;
    }
    clone() {
        return new RollNotePF2e({ ...this.toObject(), rule: this.rule });
    }
    toObject() {
        return {
            selector: this.selector,
            title: this.title,
            text: this.text,
            predicate: this.predicate.toObject(),
            outcome: this.outcome,
            visibility: this.visibility,
        };
    }
}
exports.RollNotePF2e = RollNotePF2e;
