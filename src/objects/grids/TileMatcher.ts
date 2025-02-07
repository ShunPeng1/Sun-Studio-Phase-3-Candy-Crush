import Tile from "../tiles/Tile";
import TileGrid from "./TileGrid";
import TileMatchResult from "./TileMatchResult";
import TilePotentialMatchResult from "./TilePotentialMatchResult";

class TileMatcher {
    private tileGrid : TileGrid;
    private visitedTiles: Set<Tile>;

    constructor(tileGrid : TileGrid){
        this.tileGrid = tileGrid;
    }

    

    public getMatches(): TileMatchResult[] {
        this.visitedTiles = new Set<Tile>();

        let verticalMatches = this.findVerticalMatches();
        let horizontalMatches = this.findHorizontalMatches();
        let squareMatches = this.findSquareMatches();

        let results: TileMatchResult[] = [];


        this.extract5OrMoreContinuousMatch(verticalMatches, results, horizontalMatches);
        
        this.extractCornerMatch(verticalMatches, horizontalMatches, results);
        
        this.extract4ContinuousMatch(verticalMatches, results, horizontalMatches);
       
        this.extractSquareMatch(squareMatches, results);
        
        this.extract3ContinuousMatch(verticalMatches, results, horizontalMatches);

        return results;
    }

    private extract5OrMoreContinuousMatch(verticalMatches: Tile[][], results: TileMatchResult[], horizontalMatches: Tile[][]) : void{
        
        this.sliceAllNonVisitedTileInMatch(verticalMatches);
        
        for (let i = verticalMatches.length - 1; i >= 0; i--) {

            if (verticalMatches[i].length < 5) {
                continue;
            }

            let match = verticalMatches[i];
            let originTile = match[0];
            let count = match.length;

            // Iterate through each tile in the match to find the one with the largest getLastMoveTime
            for (let tile of match) {
                let tileTime = tile.getLastMoveTime();
                if (tileTime > originTile.getLastMoveTime()) {
                    originTile = tile;
                }
            }

            results.push(new TileMatchResult(count, match, originTile, "COLOR_CLEAR"));
            this.addToVisitedTiles(match);

            verticalMatches.splice(i, 1);
            this.sliceAllNonVisitedTileInMatch(verticalMatches);
            i = verticalMatches.length;
        }

        this.sliceAllNonVisitedTileInMatch(horizontalMatches);
        for (let i = horizontalMatches.length - 1; i >= 0; i--) {
            
            if (horizontalMatches[i].length < 5) {
                continue;
            }
            
            let match = horizontalMatches[i];
            let originTile = match[0];
            let count = match.length;

            // Iterate through each tile in the match to find the one with the largest getLastMoveTime
            for (let tile of match) {
                let tileTime = tile.getLastMoveTime();
                if (tileTime > originTile.getLastMoveTime()) {
                    originTile = tile;
                }
            }

            results.push(new TileMatchResult(count, match, originTile, "COLOR_CLEAR"));
            this.addToVisitedTiles(match);
            
            horizontalMatches.splice(i, 1);
            this.sliceAllNonVisitedTileInMatch(horizontalMatches);
            i = horizontalMatches.length;
        }
        
    }


    private extractCornerMatch(verticalMatches: Tile[][], horizontalMatches: Tile[][], results: TileMatchResult[]) {
        this.sliceAllNonVisitedTileInMatch(verticalMatches);
        this.sliceAllNonVisitedTileInMatch(horizontalMatches);
        
        for (let i = verticalMatches.length - 1; i >= 0; i--) {
            for (let j = horizontalMatches.length - 1; j >= 0; j--) {
                if (i < 0 ) {
                    break;
                }

                let verticalMatch = verticalMatches[i];
                let horizontalMatch = horizontalMatches[j];

                let intersectTiles = this.intersection2TilesArray(verticalMatch, horizontalMatch);
                if (intersectTiles.length == 0){
                    continue;
                }
                    

                let unionTiles = this.union2TilesArray(verticalMatch, horizontalMatch);
                let originTile = intersectTiles[0];
                let count = unionTiles.length;


                results.push(new TileMatchResult(count, unionTiles, originTile, "BOMB"));

                this.addToVisitedTiles(unionTiles);

                horizontalMatches.splice(j, 1);
                verticalMatches.splice(i, 1);

                
                this.sliceAllNonVisitedTileInMatch(verticalMatches);
                this.sliceAllNonVisitedTileInMatch(horizontalMatches);

                i = verticalMatches.length - 1;
                j = horizontalMatches.length;
            }

        }

    }

    private extract3ContinuousMatch(verticalMatches: Tile[][], results: TileMatchResult[], horizontalMatches: Tile[][]) : void {
        this.sliceAllNonVisitedTileInMatch(verticalMatches);

        for (let i = verticalMatches.length - 1; i >= 0; i--) {
            if (verticalMatches[i].length != 3) {
                continue;
            }
            let match = verticalMatches[i];
            let originTile = match[0];
            let count = match.length;

            // Iterate through each tile in the match to find the one with the largest getLastMoveTime
            for (let tile of match) {
                let tileTime = tile.getLastMoveTime();
                if (tileTime > originTile.getLastMoveTime()) {
                    originTile = tile;
                }
            }

            results.push(new TileMatchResult(count, match, originTile, "NONE"));
            this.addToVisitedTiles(match);

            verticalMatches.splice(i, 1);
            this.sliceAllNonVisitedTileInMatch(verticalMatches);
            i = verticalMatches.length;
        }

        this.sliceAllNonVisitedTileInMatch(horizontalMatches);
            
        for (let i = horizontalMatches.length - 1; i >= 0; i--) {
            if (horizontalMatches[i].length != 3) {
                continue;
            }

            let match = horizontalMatches[i];
            let originTile = match[0];
            let count = match.length;

            // Iterate through each tile in the match to find the one with the largest getLastMoveTime
            for (let tile of match) {
                let tileTime = tile.getLastMoveTime();
                if (tileTime > originTile.getLastMoveTime()) {
                    originTile = tile;
                }
            }

            results.push(new TileMatchResult(count, match, originTile, "NONE"));
            this.addToVisitedTiles(match);

            horizontalMatches.splice(i, 1);
            this.sliceAllNonVisitedTileInMatch(horizontalMatches);
            i = horizontalMatches.length;
            
        }
    }
    
    private extract4ContinuousMatch(verticalMatches: Tile[][], results: TileMatchResult[], horizontalMatches: Tile[][]) : void{
        this.sliceAllNonVisitedTileInMatch(verticalMatches);
        for (let i = verticalMatches.length - 1; i >= 0; i--) {

            if (verticalMatches[i].length != 4 ) {
                continue;
            }

            let match = verticalMatches[i];
            let originTile = match[0];
            let count = match.length;

            // Iterate through each tile in the match to find the one with the largest getLastMoveTime
            for (let tile of match) {
                let tileTime = tile.getLastMoveTime();
                if (tileTime > originTile.getLastMoveTime()) {
                    originTile = tile;
                }
            }

            results.push(new TileMatchResult(count, match, originTile, "ROW_CLEAR"));
            this.addToVisitedTiles(match);

            verticalMatches.splice(i, 1);
            this.sliceAllNonVisitedTileInMatch(verticalMatches);
            i = verticalMatches.length;
        }

        this.sliceAllNonVisitedTileInMatch(horizontalMatches);
        for (let i = horizontalMatches.length - 1; i >= 0; i--) {
            
            if (horizontalMatches[i].length != 4) {
                continue;
            }

            let match = horizontalMatches[i];
            let originTile = match[0];
            let count = match.length;

            // Iterate through each tile in the match to find the one with the largest getLastMoveTime
            for (let tile of match) {
                let tileTime = tile.getLastMoveTime();
                if (tileTime > originTile.getLastMoveTime()) {
                    originTile = tile;
                }
            }

            results.push(new TileMatchResult(count, match, originTile, "COLUMN_CLEAR"));
            this.addToVisitedTiles(match);

            horizontalMatches.splice(i, 1);
            this.sliceAllNonVisitedTileInMatch(horizontalMatches);
            i = horizontalMatches.length;
        }
        
    }

    private extractSquareMatch(squareMatches: Tile[][], results: TileMatchResult[]) {
        
        this.sliceAllNonVisitedTileInMatch(squareMatches);

        for (let i = squareMatches.length - 1; i >= 0; i--) {
            if (squareMatches[i].length != 4) {
                continue;
            }

            let match = squareMatches[i];
            let originTile = match[0];
            let count = match.length;

            // Iterate through each tile in the match to find the one with the largest getLastMoveTime
            for (let tile of match) {
                let tileTime = tile.getLastMoveTime();
                if (tileTime > originTile.getLastMoveTime()) {
                    originTile = tile;
                }
            }

            results.push(new TileMatchResult(count, match, originTile, "RANDOM_2"));
            this.addToVisitedTiles(match);

            squareMatches.splice(i, 1);
            this.sliceAllNonVisitedTileInMatch(squareMatches);
            i = squareMatches.length;
        
        }
    }

    
    private addToVisitedTiles(match: Tile[]) {
        for (let tile of match) {
            this.visitedTiles.add(tile);
        }

    }
    

    private sliceAllNonVisitedTileInMatch(tiles: Tile[][]) {
        for (let i = tiles.length - 1; i >= 0; i--) {
            let match = tiles[i];
            
            for (let j = match.length - 1; j >= 0; j--) {
                if (this.visitedTiles.has(match[j])) {
                    // Break the array to 2 parts
                    let firstPart = match.slice(0, j);
                    let secondPart = match.slice(j + 1, match.length);
                    tiles.splice(i, 1);
                    if (firstPart.length >= 3) {
                        tiles.push(firstPart);
                        
                        i = tiles.length;
                    }
                    
                    if (secondPart.length >= 3) {
                        tiles.push(secondPart);
                        
                        i = tiles.length;
                    }
                    
                    break;
                }
            }

        }
    }

    private union2TilesArray(array1: Tile[], array2: Tile[]): Tile[] {
        return [...new Set([...array1, ...array2])];
    }

    private union3TilesArray(array1: Tile[], array2: Tile[], array3: Tile[]): Tile[] {
        return [...new Set([...array1, ...array2, ...array3])];
    }

    private intersection2TilesArray(array1: Tile[], array2: Tile[]): Tile[] {
        return array1.filter(value => array2.includes(value));
    }

    private intersection3TilesArray(array1: Tile[], array2: Tile[], array3: Tile[]): Tile[] {
        return array1.filter(value => array2.includes(value) && array3.includes(value));
    }


    
    private findHorizontalMatches(): Tile[][] {
        let horizontalMatches: Tile[][] = [];
        let groups: Tile[] = [];

        // Check for horizontal matches
        for (let y = 0; y < this.tileGrid.getRowCount(); y++) {
            let tempArray = this.tileGrid.getRow(y);
            groups = [];
            for (let x = 0; x < tempArray.length - 2; x++) {
                let tile = this.tileGrid.getTileAtIndex(x, y);
                let rightTile = this.tileGrid.getTileAtIndex(x + 1, y);
                let rightRightTile = this.tileGrid.getTileAtIndex(x + 2, y);

                if (!tile || !rightTile || !rightRightTile) {
                    continue;
                }

                if (!this.checkColorSame(tile, rightTile) ||
                    !this.checkColorSame(rightTile, rightRightTile)) {
                    continue;
                }

                if (groups.length > 0) { //If there is a match in the group already
                    if (groups.indexOf(tile) == -1) { //If the current tile is not in the group
                        horizontalMatches.push(groups);
                        groups = []; //Reset the group
                    }
                }

                if (groups.indexOf(tile) == -1) {
                    groups.push(tile);
                }

                if (groups.indexOf(rightTile) == -1) {
                    groups.push(rightTile);
                }

                if (groups.indexOf(rightRightTile) == -1) {
                    groups.push(rightRightTile);
                }
                
            
            }

            if (groups.length > 0) {
                horizontalMatches.push(groups);
            }
        }

        return horizontalMatches;
    }
    

    private findVerticalMatches(): Tile[][] {
        let verticalMatches: Tile[][] = [];
        let groups: Tile[] = [];

        // Check for vertical matches
        for (let x = 0; x < this.tileGrid.getColumnCount(); x++) { // Iterate over each column
            let groups = [];
            for (let y = 0; y < this.tileGrid.getRowCount() - 2; y++) { // Iterate over rows within the column, leaving room for comparison
                let tile = this.tileGrid.getTileAtIndex(x, y);
                let downTile = this.tileGrid.getTileAtIndex(x, y + 1);
                let downDownTile = this.tileGrid.getTileAtIndex(x, y + 2);

                if (!tile || !downTile || !downDownTile) {
                    continue; // Skip if any of the tiles in the sequence are null
                }

                if (!this.checkColorSame(tile, downTile) ||
                    !this.checkColorSame(downTile, downDownTile)) {
                    continue; // Skip if the tiles do not match
                }

                // If there is a match in the group already and the current tile is not in the group
                if (groups.length > 0 && groups.indexOf(tile) == -1) {
                    verticalMatches.push(groups); // Push the current group to matches
                    groups = []; // Reset the group
                }

                // Add tiles to the group if they are not already included
                if (groups.indexOf(tile) == -1) {
                    groups.push(tile);
                }
                if (groups.indexOf(downTile) == -1) {
                    groups.push(downTile);
                }
                if (groups.indexOf(downDownTile) == -1) {
                    groups.push(downDownTile);
                }
            }
            if (groups.length > 0) {
                verticalMatches.push(groups);
            }
        }

        return verticalMatches;
    }

    private findSquareMatches(): Tile[][] {
        let squareMatches: Tile[][] = [];

        // Check for square matches
        for (let y = 0; y < this.tileGrid.getRowCount() - 1; y++) {
            for (let x = 0; x < this.tileGrid.getColumnCount() - 1; x++) {
                let tile = this.tileGrid.getTileAtIndex(x, y);
                let rightTile = this.tileGrid.getTileAtIndex(x + 1, y);
                let downTile = this.tileGrid.getTileAtIndex(x, y + 1);
                let downRightTile = this.tileGrid.getTileAtIndex(x + 1, y + 1);

                if (!tile || !rightTile || !downTile || !downRightTile) {
                    continue;
                }
                
                if (!this.checkColorSame(tile, rightTile) ||
                    !this.checkColorSame(tile, downTile) ||
                    !this.checkColorSame(tile, downRightTile)) {
                    continue;
                }

                squareMatches.push([tile, rightTile, downTile, downRightTile]);
            }
        }

        return squareMatches;
    }

    private findPotentialHorizontalMatches(): TilePotentialMatchResult[] {
        let horizontalPotentialMatches: TilePotentialMatchResult[] = [];

        // Check for horizontal matches
        for (let y = 0; y < this.tileGrid.getRowCount(); y++) {
            let tempArray = this.tileGrid.getRow(y);
     
            for (let x = -1; x < tempArray.length - 2; x++) {
                let tile = this.tileGrid.getTileAtIndex(x, y);
                let rightTile = this.tileGrid.getTileAtIndex(x + 1, y);
                let rightRightTile = this.tileGrid.getTileAtIndex(x + 2, y);
                let rightRightRightTile = this.tileGrid.getTileAtIndex(x + 3, y);

                if (tile && rightTile && rightRightTile && (!rightRightRightTile || !this.checkColorSame(rightRightRightTile, rightRightTile))) {
                    
                    if (!this.checkColorSame(tile, rightTile) && this.checkColorSame(rightTile, rightRightTile)) {
                        
                        let upTile = this.tileGrid.getTileAtIndex(x, y - 1);
                        let downTile = this.tileGrid.getTileAtIndex(x, y + 1);
                        let leftTile = this.tileGrid.getTileAtIndex(x - 1, y);

                        let fromTile = tile;
                        let matchTiles = [rightTile, rightRightTile];


                        if (upTile && this.checkColorSame(upTile, rightTile)) {
                            horizontalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, upTile));
                        }

                        if (downTile && this.checkColorSame(downTile, rightTile)) {
                            horizontalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, downTile));
                        }

                        if (leftTile && this.checkColorSame(leftTile, rightTile)) {
                            horizontalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, leftTile));
                        }

                    }

                }

                if (rightTile && rightRightTile && rightRightRightTile && (!tile || !this.checkColorSame(tile, rightTile))) {
                    if (this.checkColorSame(rightTile, rightRightTile) && !this.checkColorSame(rightTile, rightRightRightTile)) {
                        let rightRightRightUpTile = this.tileGrid.getTileAtIndex(x + 3, y - 1);
                        let rightRightRightDownTile = this.tileGrid.getTileAtIndex(x + 3, y + 1);
                        let rightRightRightRightTile = this.tileGrid.getTileAtIndex(x + 4, y);

                        let fromTile = rightRightRightTile;
                        let matchTiles = [rightTile, rightRightTile];

                        if (rightRightRightUpTile && this.checkColorSame(rightRightRightUpTile, rightTile)) {
                            horizontalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, rightRightRightUpTile));
                        }

                        if (rightRightRightDownTile && this.checkColorSame(rightRightRightDownTile, rightTile)) {
                            horizontalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, rightRightRightDownTile));
                        }

                        if (rightRightRightRightTile && this.checkColorSame(rightRightRightRightTile, rightTile)) {
                            horizontalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, rightRightRightRightTile));
                        }
                    }
                }

                if (tile && rightTile && rightRightTile){
                    if (this.checkColorSame(tile, rightRightTile) && !this.checkColorSame(rightTile, tile)) {
                        let rightUpTile = this.tileGrid.getTileAtIndex(x + 1, y - 1);
                        let rightDownTile = this.tileGrid.getTileAtIndex(x + 1, y + 1);
                        let fromTile = rightTile;
                        let matchTiles = [tile, rightRightTile];

                        if (rightUpTile && this.checkColorSame(rightUpTile, tile)) {
                            horizontalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, rightUpTile));
                        }

                        if (rightDownTile && this.checkColorSame(rightDownTile, tile)) {
                            horizontalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, rightDownTile));
                        }
                    }
                }

                if (rightTile && rightRightTile && rightRightRightTile) {
                    if (this.checkColorSame(rightTile, rightRightRightTile) && !this.checkColorSame(rightTile, rightRightTile)) {
                        let rightRightUpTile = this.tileGrid.getTileAtIndex(x + 2, y - 1);
                        let rightRightDownTile = this.tileGrid.getTileAtIndex(x + 2, y + 1);
                        let fromTile = rightRightTile;
                        let matchTiles = [rightTile, rightRightRightTile];

                        if (rightRightUpTile && this.checkColorSame(rightRightUpTile, rightTile)) {
                            horizontalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, rightRightUpTile));
                        }

                        if (rightRightDownTile && this.checkColorSame(rightRightDownTile, rightTile)) {
                            horizontalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, rightRightDownTile));
                        }
                    }
                }
            }
        }

        return horizontalPotentialMatches;
    }
    
    public getPotentialMatches(): TilePotentialMatchResult[] {
        let horizontalPotentialMatches = this.findPotentialHorizontalMatches();
        let verticalPotentialMatches = this.findPotentialVerticalMatches();
        let results = [...horizontalPotentialMatches, ...verticalPotentialMatches];

        return results;
    }

    private findPotentialVerticalMatches(): TilePotentialMatchResult[] {
        let verticalPotentialMatches: TilePotentialMatchResult[] = [];

        // Check for vertical matches
        for (let x = 0; x < this.tileGrid.getColumnCount(); x++) {
            for (let y = -1; y < this.tileGrid.getRowCount() - 2; y++) {
                let tile = this.tileGrid.getTileAtIndex(x, y);
                let downTile = this.tileGrid.getTileAtIndex(x, y + 1);
                let downDownTile = this.tileGrid.getTileAtIndex(x, y + 2);
                let downDownDownTile = this.tileGrid.getTileAtIndex(x, y + 3);

                if (tile && downTile && downDownTile && (!downDownDownTile || !this.checkColorSame(downDownDownTile, downDownTile))) {
                    if (!this.checkColorSame(tile, downTile) && this.checkColorSame(downTile, downDownTile)) {
                        let leftTile = this.tileGrid.getTileAtIndex(x - 1, y);
                        let rightTile = this.tileGrid.getTileAtIndex(x + 1, y);
                        let upTile = this.tileGrid.getTileAtIndex(x, y - 1);
                        let fromTile = tile;
                        let matchTiles = [downTile, downDownTile];

                        if (leftTile && this.checkColorSame(leftTile, downTile)) {
                            verticalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, leftTile));
                        }

                        if (rightTile && this.checkColorSame(rightTile, downTile)) {
                            verticalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, rightTile));
                        }

                        if (upTile && this.checkColorSame(upTile, downTile)) {
                            verticalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, upTile));
                        }
                    }
                }

                if (downTile && downDownTile && downDownDownTile && (!tile || !this.checkColorSame(tile, downTile))) {
                    if (this.checkColorSame(downTile, downDownTile) && !this.checkColorSame(downTile, downDownDownTile)) {
                        let downDownDownLeftTile = this.tileGrid.getTileAtIndex(x - 1, y + 3);
                        let downDownDownRightTile = this.tileGrid.getTileAtIndex(x + 1, y + 3);
                        let downDownDownDownTile = this.tileGrid.getTileAtIndex(x, y + 4);

                        let fromTile = downDownDownTile;
                        let matchTiles = [downTile, downDownTile];

                        if (downDownDownDownTile && this.checkColorSame(downDownDownDownTile, downTile)) {
                            verticalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, downDownDownDownTile));
                        }
                        
                        if (downDownDownLeftTile && this.checkColorSame(downDownDownLeftTile, downTile)) {
                            verticalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, downDownDownLeftTile));
                        }

                        if (downDownDownRightTile && this.checkColorSame(downDownDownRightTile, downTile)) {
                            verticalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, downDownDownRightTile));
                        }
                    }
                }

                if (tile && downTile && downDownTile){
                    if (this.checkColorSame(tile, downDownTile) && !this.checkColorSame(downTile, tile)) {
                        let downLeftTile = this.tileGrid.getTileAtIndex(x - 1, y + 1);
                        let downRightTile = this.tileGrid.getTileAtIndex(x + 1, y + 1);
                        let fromTile = downTile;
                        let matchTiles = [tile, downDownTile];

                        if (downLeftTile && this.checkColorSame(downLeftTile, tile)) {
                            verticalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, downLeftTile));
                        }

                        if (downRightTile && this.checkColorSame(downRightTile, tile)) {
                            verticalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, downRightTile));
                        }
                    }
                }

                if (downTile && downDownTile && downDownDownTile) {
                    if (this.checkColorSame(downTile, downDownDownTile) && !this.checkColorSame(downDownTile, downTile)) {
                        let downDownLeftTile = this.tileGrid.getTileAtIndex(x - 1, y + 2);
                        let downDownRightTile = this.tileGrid.getTileAtIndex(x + 1, y + 2);
                        let fromTile = downDownTile;
                        let matchTiles = [downTile, downDownDownTile];

                        if (downDownLeftTile && this.checkColorSame(downDownLeftTile, downTile)) {
                            verticalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, downDownLeftTile));
                        }

                        if (downDownRightTile && this.checkColorSame(downDownRightTile, downTile)) {
                            verticalPotentialMatches.push(new TilePotentialMatchResult(matchTiles, fromTile, downDownRightTile));
                        }
                    }
                }
            }
        }
        return verticalPotentialMatches;
    }

    private checkColorSame(tile1: Tile, tile2: Tile): boolean {
        if (tile1 && tile2 && tile1.getColor() != "" && tile2.getColor() != ""){
            return tile1.getColor() === tile2.getColor();
        }
        return false;
    }

}

export default TileMatcher;