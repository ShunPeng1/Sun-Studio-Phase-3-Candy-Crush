import { GameObjects } from "phaser";
import Tile from "../tiles/Tile";
import TileSimulation from "./TileSimulation";
import TileGrid from "../grids/TileGrid";
import TilePlaceholder from "./TilePlaceholder";
import CONST from "../../const/const";

class TileCircleShuffleSimulation extends TileSimulation {
    private tileGrid : TileGrid;
    private radius: number;
    private duration: number;
    private x: number;
    private y: number;

    private callback : ()=>void;


    constructor(scene: Phaser.Scene, tileGrid : TileGrid, x: number, y: number, radius: number, duration : number, callback : ()=>void = () =>{}) {
        super(scene, tileGrid.getTileGrid());
        this.tileGrid = tileGrid;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.duration = duration;
        this.callback = callback;
    }
    
    public start(): void {
        super.start();

        let inPlaceholders : TilePlaceholder[] = []; 
        let outPlaceholders : TilePlaceholder[] = [];
        
        let maskGraphics = this.scene.add.graphics();
        maskGraphics.fillRect(400, 70 , CONST.gridWidth * CONST.tileWidth, (CONST.gridHeight+1) * CONST.tileHeight);
        maskGraphics.fillStyle(0xffffff); // Setting the fill style to white
        
        let tiles = this.getFlattenTiles();
        tiles.forEach((tile) => {
            tile.disableTileInteraction();
            let worldPosition = this.tileGrid.getWorldPositionFromTile(tile);
            let index = this.tileGrid.getTileIndex(tile);

            if (index === null) {
                console.error('TileCircleShuffleSimulation: Tile is not in the grid');
                return;
            }

            this.tileGrid.removeTile(tile);
            tile.setMask(maskGraphics.createGeometryMask());
            tile.setPosition(worldPosition.x, worldPosition.y);
            inPlaceholders.push(new TilePlaceholder(this.scene, worldPosition.x, worldPosition.y, index));
            outPlaceholders.push(new TilePlaceholder(this.scene, this.x, this.y, index));
        });

        Phaser.Utils.Array.Shuffle(tiles);
        Phaser.Utils.Array.Shuffle(outPlaceholders);
        const inPlaceholderGroup = this.scene.add.group(inPlaceholders);
        const outPlaceholderGroup = this.scene.add.group(outPlaceholders);

        const tileGroup = this.scene.add.group(tiles);

        const circle = new Phaser.Geom.Circle(this.x, this.y, this.radius);

        Phaser.Actions.PlaceOnCircle(inPlaceholderGroup.getChildren(), circle);


        let count = 0;
        tiles.forEach((tile, index) => {
            const inPlaceholder = inPlaceholders[index];
            const inMatrix = inPlaceholder.getWorldTransformMatrix();

            const outPlaceholder = outPlaceholders[index];
            const outWorldPosition = this.tileGrid.getWorldPositionFromIndex(outPlaceholder.index.x, outPlaceholder.index.y);


            this.scene.tweens.chain({
                tweens : [{
                    targets: tile,
                    x: inMatrix.tx,
                    y: inMatrix.ty,
                    ease: Phaser.Math.Easing.Cubic.InOut,
                    duration: this.duration/4,
                },{

                    targets: circle,
                    radius: this.radius,
                    ease: 'Linear',
                    duration: this.duration/2,
                    onUpdate: () => {
                        Phaser.Actions.RotateAroundDistance(tileGroup.getChildren(), { x: this.x, y: this.y }, 0.0006, circle.radius);
                    }
                },{
                    targets: tile,
                    x: outWorldPosition.x,
                    y: outWorldPosition.y,
                    ease: Phaser.Math.Easing.Cubic.InOut,
                    duration: this.duration/4          

                }],
                onComplete: () => {
                    this.tileGrid.addTileAtIndex(tile, outPlaceholder.index.x, outPlaceholder.index.y);
                    tile.enableTileInteraction();
                    tile.clearMask();

                    if (++count === tiles.length) {
                        this.callback();
                    }
                }
            });
        });


    }

    
}

export default TileCircleShuffleSimulation;
