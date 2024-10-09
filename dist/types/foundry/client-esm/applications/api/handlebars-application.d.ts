import type ApplicationV2 from "./application.js";
/** Augment an Application class with [Handlebars](https://handlebarsjs.com) template rendering behavior. */
export default function HandlebarsApplicationMixin<TBase extends ConstructorOf<ApplicationV2>>(BaseApplication: TBase): {
    new (...args: any[]): {
        /** A record of all rendered template parts. */
        readonly parts: Record<string, HTMLElement>;
        /**
         * Render each configured application part using Handlebars templates.
         * @param context        Context data for the render operation
         * @param options        Options which configure application rendering behavior
         * @returns A single rendered HTMLElement for each requested part
         */
        _renderHTML(context: ApplicationRenderContext, options: HandlebarsRenderOptions): Promise<Record<string, HTMLElement>>;
        /**
         * Prepare context that is specific to only a single rendered part.
         *
         * It is recommended to augment or mutate the shared context so that downstream methods like _onRender have
         * visibility into the data that was used for rendering. It is acceptable to return a different context object
         * rather than mutating the shared context at the expense of this transparency.
         *
         * @param partId       The part being rendered
         * @param context      Shared context provided by _prepareContext
         * @returns Context data for a specific part
         */
        _preparePartContext(partId: string, context: ApplicationRenderContext): Promise<ApplicationRenderContext>;
        /**
         * Replace the HTML of the application with the result provided by Handlebars rendering.
         * @param result  The result from Handlebars template rendering
         * @param content The content element into which the rendered result must be inserted
         * @param options     Options which configure application rendering behavior
         */
        _replaceHTML(result: Record<string, HTMLElement>, content: HTMLElement, options: HandlebarsRenderOptions): void;
        /**
         * Prepare data used to synchronize the state of a template part.
         * @param partId       The id of the part being rendered
         * @param newElement   The new rendered HTML element for the part
         * @param priorElement The prior rendered HTML element for the part
         * @param state        A state object which is used to synchronize after replacement
         */
        _preSyncPartState(partId: string, newElement: HTMLElement, priorElement: HTMLElement, state: object): void;
        /**
         * Synchronize the state of a template part after it has been rendered and replaced in the DOM.
         * @param partId                  The id of the part being rendered
         * @param newElement              The new rendered HTML element for the part
         * @param priorElement            The prior rendered HTML element for the part
         * @param state                   A state object which is used to synchronize after replacement
         */
        _syncPartState(partId: string, newElement: HTMLElement, priorElement: HTMLElement, state: object): void;
        /**
         * Attach event listeners to rendered template parts.
         * @param partId       The id of the part being rendered
         * @param htmlElement  The rendered HTML element for the part
         * @param options       Rendering options passed to the render method
         */
        _attachPartListeners(partId: string, htmlElement: HTMLElement, options: HandlebarsRenderOptions): void;
        options: ApplicationConfiguration;
        readonly window: {
            header: HTMLElement;
            title: HTMLHeadingElement;
            icon: HTMLElement;
            close: HTMLButtonElement;
            controls: HTMLButtonElement; /**
             * Prepare context that is specific to only a single rendered part.
             *
             * It is recommended to augment or mutate the shared context so that downstream methods like _onRender have
             * visibility into the data that was used for rendering. It is acceptable to return a different context object
             * rather than mutating the shared context at the expense of this transparency.
             *
             * @param partId       The part being rendered
             * @param context      Shared context provided by _prepareContext
             * @returns Context data for a specific part
             */
            controlsDropdown: HTMLDivElement;
            onDrag: Function;
            onResize: Function;
            pointerStartPosition: ApplicationPosition;
            pointerMoveThrottle: boolean;
        };
        tabGroups: Record<string, string>;
        readonly classList: DOMTokenList | undefined;
        readonly id: string;
        readonly title: string;
        readonly element: HTMLElement;
        readonly minimized: boolean;
        position: ApplicationPosition;
        readonly rendered: boolean;
        readonly state: number;
        readonly hasFrame: boolean;
        _initializeApplicationOptions(options: Partial<ApplicationConfiguration>): ApplicationConfiguration;
        render(options?: boolean | Partial<ApplicationRenderOptions> | undefined, _options?: Partial<ApplicationRenderOptions> | undefined): Promise<any>;
        _configureRenderOptions(options: ApplicationRenderOptions): void;
        _prepareContext(options: ApplicationRenderOptions): Promise<ApplicationRenderContext>;
        _getHeaderControls(): ApplicationHeaderControlsEntry[];
        _renderFrame(options: ApplicationRenderOptions): Promise<HTMLElement>;
        _renderHeaderControl(control: ApplicationHeaderControlsEntry): HTMLLIElement;
        _updateFrame(options: ApplicationRenderOptions): void;
        _insertElement(element: HTMLElement): void;
        close(options?: ApplicationClosingOptions | undefined): Promise<any>;
        _removeElement(element: HTMLElement): void;
        setPosition(position?: Partial<ApplicationPosition> | undefined): ApplicationPosition;
        _updatePosition(position: ApplicationPosition): ApplicationPosition;
        toggleControls(expanded?: boolean | undefined): void;
        minimize(): Promise<void>;
        maximize(): Promise<void>;
        bringToFront(): void;
        changeTab(tab: string, group: string, options?: {
            event?: Event | undefined;
            navElement?: HTMLElement | undefined;
            force?: boolean | undefined;
            updatePosition?: boolean | undefined;
        } | undefined): void;
        _canRender(options: ApplicationRenderOptions): false | void;
        _preFirstRender(context: ApplicationRenderContext, options: ApplicationRenderOptions): Promise<void>;
        _onFirstRender(context: ApplicationRenderContext, options: ApplicationRenderOptions): void;
        _preRender(context: ApplicationRenderContext, options: ApplicationRenderOptions): Promise<void>;
        _onRender(context: ApplicationRenderContext, options: ApplicationRenderOptions): void;
        _preClose(options: ApplicationRenderOptions): Promise<void>;
        _onClose(options: ApplicationClosingOptions): void;
        _prePosition(position: ApplicationPosition): void;
        _onPosition(position: ApplicationPosition): void;
        _attachFrameListeners(): void;
        _onClickAction(event: PointerEvent, target: HTMLElement): void;
        _onSubmitForm(formConfig: ApplicationFormConfiguration, event: Event | SubmitEvent): Promise<void>;
        _onChangeForm(formConfig: ApplicationFormConfiguration, event: Event): void;
        _awaitTransition(element: HTMLElement, timeout: number): Promise<void>;
        addEventListener(type: string, listener: import("./event-emitter.js").EmittedEventListener, options?: {
            once?: boolean | undefined;
        } | undefined): void;
        removeEventListener(type: string, listener: import("./event-emitter.js").EmittedEventListener): void;
        dispatchEvent(event: Event): boolean;
    };
    PARTS: Record<string, HandlebarsTemplatePart>;
} & TBase;
export interface HandlebarsTemplatePart {
    /** The template entry-point for the part */
    template: string;
    /**
     * A CSS id to assign to the top-level element of the rendered part.
     * This id string is automatically prefixed by the application id.
     */
    id?: string;
    /** An array of CSS classes to apply to the top-level element of the rendered part. */
    classes?: string[];
    /**
     * An array of templates that are required to render the part.
     * If omitted, only the entry-point is inferred as required.
     */
    templates?: string[];
    /**
     * An array of selectors within this part whose scroll positions should
     * be persisted during a re-render operation. A blank string is used
     * to denote that the root level of the part is scrollable.
     */
    scrollable?: boolean[];
    /** A registry of forms selectors and submission handlers. */
    forms?: Record<string, ApplicationFormConfiguration>;
}
export interface HandlebarsRenderOptions extends ApplicationRenderOptions {
    /** An array of named template parts to render */
    parts?: string[];
}
