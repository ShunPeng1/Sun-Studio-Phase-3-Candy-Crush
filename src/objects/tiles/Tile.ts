
class Tile extends Phaser.GameObjects.Image {
    constructor(params: IImageConstructor) {
        super(params.scene, params.x, params.y, params.texture, params.frame);

        // set image settings
        this.setOrigin(0, 0);
        this.setInteractive();

        this.scene.add.existing(this);
    }
}


export default Tile;