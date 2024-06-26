type EmittedEventListener = (event: Event) => any;

export default class EventEmitter<TEvent extends string = string> {
    static emittedEvents: readonly string[];

    /**
     * Add a new event listener for a certain type of event.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     */
    addEventListener(
        type: TEvent,
        listener: EmittedEventListener,
        options?: { once?: boolean }
    ): void;

    /**
     * Remove an event listener for a certain type of event.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
     */
    removeEventListener(type: TEvent, listener: EmittedEventListener): void;

    /**
     * Dispatch an event on this target.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
     */
    dispatchEvent(event: Event): boolean;
}
