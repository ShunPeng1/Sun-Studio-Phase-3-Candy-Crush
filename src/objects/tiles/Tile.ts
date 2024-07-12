import TweenUtilities from "../../ultilities/TweenUtilities";
import TileGrid from "../grids/TileGrid";

class Tile extends Phaser.GameObjects.Image {
    private tileEffect: ITileEffect;
    private grid : TileGrid;
    private tileWidth: number = 0;
    private tileHeight: number = 0;


    private mapTween : Map<string, Phaser.Tweens.Tween> = new Map<string, Phaser.Tweens.Tween>();
    private isPointerOver: boolean = false; 
    private isDestroyed: boolean = false;
    private isPop: boolean = false;
    
    constructor(params: IImageConstructor) {
        super(params.scene, params.x, params.y, params.texture, params.frame);


        // set image settings
        this.setOrigin(0.5, 0.5);

        this.scene.add.existing(this);

    }

    public disableTileInteraction(): void {
        if (this.isDestroyed) return;

        this.disableInteractive();

        if (this.isPointerOver) { 
            this.emit('pointerout');
        }
        this.off('pointerover');
        this.off('pointerout');
    
    }

    public enableTileInteraction(): void {
        if (this.isDestroyed) return;
        
        this.setInteractive();
        this.on('pointerover', this.onPointerOver, this);
        this.on('pointerout', this.onPointerOut, this);
        
        TweenUtilities.applyImageDisplaySizeTweens(this, 'pointerover', 'pointerout', this.tileWidth, this.tileHeight, 1.1, 100);

    }

    public addMapTween(key: string, tween: Phaser.Tweens.Tween): void {
        this.mapTween.set(key, tween);
    }

    public getMapTween(key: string): Phaser.Tweens.Tween | undefined {
        return this.mapTween.get(key);
    }

    public removeMapTween(key: string): void {
        this.mapTween.delete(key);
    }

    private onPointerOver(): void {
        this.isPointerOver = true; 
    }

    private onPointerOut(): void {
        this.isPointerOver = false; 
    }

    public setTileEffect(tileEffect: ITileEffect): this {
        this.tileEffect = tileEffect;
        this.tileEffect.onTileAppear();

        return this;
    }

    public setTileGrid(grid : TileGrid, tileWidth : number, tileHeight : number ) : this { 
        this.grid = grid;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        
        this.enableTileInteraction();
        return this;
    }
    
    public getWorldPosition() {
        const gridWorldTransform = this.grid.getWorldTransformMatrix();

        let localTransform = this.getLocalTransformMatrix();
    
        localTransform.tx += gridWorldTransform.tx
        localTransform.ty += gridWorldTransform.ty;

        return localTransform;
    }

    public getTileGrid() : TileGrid {
        return this.grid;
    }

    public getTileWidth() : number {
        return this.tileWidth;
    }

    public getTileHeight() : number {
        return this.tileHeight;
    }

    public getColor(): string {
        return this.tileEffect.color;
    }

    public pop(): void {
        if (this.isPop) return;
        this.isPop = true;
        this.tileEffect.onTilePop();
    }

    public destroy(fromScene?: boolean): void {
        if (this.isDestroyed) return;

        this.isDestroyed = true;
        this.tileEffect.onTileDestroy();
        super.destroy(fromScene);
    }


}


export default Tile;