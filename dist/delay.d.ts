declare function createTimeout<TArgs extends any[]>(callback: (...args: TArgs) => void, delay?: number): ((...args: TArgs) => void) & {
    start: (delay: number, ...args: TArgs) => void;
    cancel: () => void;
};
export { createTimeout };
