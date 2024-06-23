import ApplicationV2 from "./application.js";

export default class DialogV2 extends ApplicationV2 {
    /**
     * A utility helper to generate a dialog with yes and no buttons.
     * @param {Partial<ApplicationConfiguration & DialogV2Configuration & DialogV2WaitOptions>} [options]
     * @param {DialogV2Button} [options.yes]  Options to overwrite the default yes button configuration.
     * @param {DialogV2Button} [options.no]   Options to overwrite the default no button configuration.
     * @returns {Promise<any>}                Resolves to true if the yes button was pressed, or false if the no button
     *                                        was pressed. If additional buttons were provided, the Promise resolves to
     *                                        the identifier of the one that was pressed, or the value returned by its
     *                                        callback. If the dialog was dismissed, and rejectClose is false, the
     *                                        Promise resolves to null.
     */
    static confirm(
        options?: PartialApplicationConfiguration &
            Partial<DialogV2Configuration & DialogV2WaitOptions> & {
                yes?: Partial<DialogV2Button>;
                no?: Partial<DialogV2Button>;
            }
    ): Promise<true | false | null>;
}
