export type FarmInitFn = (farm: Farm) => void;
export type FarmTile =
    | 'empty'
    | 'wood-house'
    | 'clay-house'
    | 'stone-house'
    | 'field';

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

    setTile(row: number, column: number, tile: FarmTile) {
        this.tiles[row][column] = tile;
    }

    getTiles(): FarmTile[][] {
        return this.tiles;
    }
}
