export {};

declare global {
    namespace PIXI {
        class ColorMatrixFilter extends PIXI.Filter {
            sepia(multiply?: boolean): void;
            contrast(scale: number, multiply?: boolean): void;
            greyscale(scale: number, multiply?: boolean): void;
        }
    }
}
