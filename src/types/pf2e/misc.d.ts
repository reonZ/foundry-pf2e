export {};

declare global {
    interface RestForTheNightOptions extends ActionDefaultOptions {
        skipDialog?: boolean;
    }
}
