export type FarmInitFn = (farm: Farm) => void;
export type FarmTile =
    | 'empty'
    | 'wood-house'
    | 'clay-house'
    | 'stone-house'
    | 'stable'
    | 'field';

export interface FarmCoordinate {
    row: number;
    column: number;
}

export class Farm {
    // Stored in row major order.
    private readonly tiles: FarmTile[][] = [];

    constructor(width: number, height: number, initFarm: FarmInitFn) {
        for (let row = 0; row < height; row++) {
            this.tiles.push([]);

            for (let col = 0; col < width; col++) {
                this.tiles[this.tiles.length - 1].push('empty');
            }
        }

        initFarm(this);
    }

    getTile(row: number, column: number): FarmTile {
        return this.tiles[row][column];
    }

    getTileMaybeUndefined(row: number, column: number): FarmTile | undefined {
        const tileRow = this.tiles[row];
        if (!tileRow) {
            return undefined;
        }

        return tileRow[column];
    }

    getAdjacentTiles(row: number, column: number): (FarmTile | undefined)[] {
        return [
            this.getTileMaybeUndefined(row - 1, column),
            this.getTileMaybeUndefined(row + 1, column),
            this.getTileMaybeUndefined(row, column - 1),
            this.getTileMaybeUndefined(row, column + 1),
        ].filter((t) => t !== undefined);
    }

    setTile(row: number, column: number, tile: FarmTile) {
        this.tiles[row][column] = tile;
    }

    getTiles(): FarmTile[][] {
        return this.tiles;
    }
}
