import TweenUtilities from "../../ultilities/TweenUtilities";
import TileGrid from "../grids/TileGrid";

class Tile extends Phaser.GameObjects.Image {
    private tileEffect: ITileEffect;
    private grid : TileGrid;

    private mapTween : Map<string, Phaser.Tweens.Tween> = new Map<string, Phaser.Tweens.Tween>();
    private isPointerOver: boolean = false; 
    
    constructor(params: IImageConstructor) {
        super(params.scene, params.x, params.y, params.texture, params.frame);


        // set image settings
        this.setOrigin(0.5, 0.5);
        this.enableTileInteraction();

        this.scene.add.existing(this);

        
    }

    public disableTileInteraction(): void {
        this.disableInteractive();

        if (this.isPointerOver) { 
            this.emit('pointerout');
        }
        this.off('pointerover');
        this.off('pointerout');
    
    }

    public enableTileInteraction(): void {
        try{
            this.setInteractive();
            this.on('pointerover', this.onPointerOver, this);
            this.on('pointerout', this.onPointerOut, this);
            
            TweenUtilities.applyImageDisplaySizeTweens(this, 'pointerover', 'pointerout', 1.1, 100);
    
        }
        catch (error){
            // Ignore
        }
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

    public getWorldPosition() {
        const gridWorldTransform = this.grid.getWorldTransformMatrix();

        let localTransform = this.getLocalTransformMatrix();
    
        localTransform.tx += gridWorldTransform.tx
        localTransform.ty += gridWorldTransform.ty;

        return localTransform;
    }

    public setTileEffect(tileEffect: ITileEffect): this {
        this.tileEffect = tileEffect;
        return this;
    }

    public setTileGrid(grid : TileGrid) : this { 
        this.grid = grid;
        return this;
    }
    
    public getColor(): string {
        return this.tileEffect.color;
    }

    public destroy(fromScene?: boolean): void {
        this.tileEffect.onTilePop();
        super.destroy(fromScene);
    }


}


export default Tile;