import { FarmTile } from '../farm';
import { ResourceMap, Resource } from '../resource';
import { InputRequest, PlayerState } from '../state-player';
import { Action } from './action';

export const ANY_NUMBER = 0;

export class BuildOnFarmAction extends Action {
    constructor(
        name: string,
        costPerTile: Partial<ResourceMap> = {},
        private readonly tileToBuild: FarmTile,
        private readonly requiredPreviousState: FarmTile = 'empty',
        private readonly availableToBuild: number = 1
    ) {
        super(name, costPerTile);
    }

    override prepare(state: PlayerState): boolean {
        return false;
        // if (state.buildAction?.response) {
        //     return true;
        // }
        // state.buildAction = {
        //     request: {
        //         action: this,
        //         possibleTileTypes: [this.requiredPreviousState],
        //         availableToBuild: this.availableToBuild,
        //         // costPerTile: this.costPerTile,
        //     },
        // };
        // return false;
    }

    override inputRequest(
        updatePlayer: (updater: (player: PlayerState) => PlayerState) => void
    ): InputRequest {
        return {
            minTiles: 1,
            maxTiles: this.availableToBuild,
            costPerTile: { wood: 2 },
            isValidTile: (farm, { row, column }) => {
                return farm.getTile(row, column) === this.requiredPreviousState;
            },
            onRequestSatisfied: (tiles) => {
                updatePlayer((player) => {
                    // Update the tiles.
                    for (const tile of tiles) {
                        player.farm.setTile(
                            tile.row,
                            tile.column,
                            this.tileToBuild
                        );
                    }

                    player.inputRequest = undefined;

                    return player;
                });
            },
        };
    }

    override performAction(state: PlayerState): boolean {
        // if (!state.buildAction?.response) {
        //     return false;
        // }

        // super.performAction(state);
        // for (const response of state.buildAction.response) {
        //     state.farm.setTile(response.row, response.column, this.tileToBuild);

        //     // for (const resourceStr in this.costPerTile) {
        //     //     const resource = resourceStr as Resource;
        //     //     const resourceCost = this.costPerTile[resource];
        //     //     if (resourceCost) {
        //     //         state.resources[resource] -= resourceCost;
        //     //     }
        //     // }
        // }

        return true;
    }

    override postAction(state: PlayerState) {
        // state.buildAction = undefined;
    }
}
