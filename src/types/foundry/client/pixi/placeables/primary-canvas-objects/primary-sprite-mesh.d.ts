export {};

declare global {
    /**
     * A basic PCO sprite mesh which is handling occlusion and depth.
     * @extends {SpriteMesh}
     * @mixes PrimaryOccludableObjectMixin
     * @mixes PrimaryCanvasObjectMixin
     *
     * @property {PrimaryBaseSamplerShader} shader             The shader bound to this mesh.
     *
     * @param {object} [options]                               The constructor options.
     * @param {PIXI.Texture} [options.texture]                 Texture passed to the SpriteMesh.
     * @param {typeof PrimaryBaseSamplerShader} [options.shaderClass]   The shader class used to render this sprite.
     * @param {string|null} [options.name]                     The name of this sprite.
     * @param {*} [options.object]                             Any object that owns this sprite.
     */
    class PrimarySpriteMesh extends SpriteMesh {
        /**
         * The elevation of this object.
         * @type {number}
         */
        get elevation(): number;

        set elevation(value);
    }
}
