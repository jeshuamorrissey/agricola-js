import { Farm, FarmCoordinate, FarmTile } from '../farm';
import { payResources } from '../resource';
import {
    FarmTileInputRequest,
    PlayerState,
    PlayerStateUpdateFn,
} from '../state/state.player';
import { Action, ActionProps } from './action';

export type IsValidTileFn = (
    farm: Farm,
    location: FarmCoordinate,
    selectedTiles: FarmCoordinate[]
) => boolean;

export interface BuildOnFarmActionProps {
    tileToBuild: FarmTile | ((player: PlayerState) => FarmTile);
    costPerTileName: string;
    minTilesToBuild: number;
    maxTilesToBuild: number;
    isValidTile: IsValidTileFn;
}

export class BuildOnFarmAction extends Action {
    private readonly __tileToBuild:
        | FarmTile
        | ((player: PlayerState) => FarmTile);
    private readonly __costPerTileName;
    private readonly __minTilesToBuild: number;
    private readonly __maxTilesToBuild: number;
    private readonly __isValidTileFn: IsValidTileFn;

    constructor({
        tileToBuild,
        costPerTileName,
        minTilesToBuild = 1,
        maxTilesToBuild = 1,
        isValidTile,
        ...props
    }: BuildOnFarmActionProps & ActionProps) {
        super(props);

        this.__tileToBuild = tileToBuild;
        this.__costPerTileName = costPerTileName;
        this.__minTilesToBuild = minTilesToBuild;
        this.__maxTilesToBuild = maxTilesToBuild;
        this.__isValidTileFn = isValidTile;
    }

    override costPerTileName(): string {
        return this.__costPerTileName;
    }

    override execute(
        player: PlayerState,
        updatePlayerFn: PlayerStateUpdateFn
    ): FarmTileInputRequest {
        return {
            id: 'farm-tile-input-request',
            actionName: this.name,
            minTiles: this.__minTilesToBuild,
            maxTiles: this.__maxTilesToBuild,
            costPerTile: this.getCost(player),
            isValidTile: this.__isValidTileFn,
            onRequestSatisfied: (tiles) => {
                updatePlayerFn((player) => {
                    for (const tile of tiles) {
                        player.farm.setTile(
                            tile.row,
                            tile.column,
                            this.__tileToBuild instanceof Function
                                ? this.__tileToBuild(player)
                                : this.__tileToBuild
                        );

                        player.resources = payResources(
                            player.resources,
                            this.getCost(player)
                        );
                    }
                });
            },
        };
    }
}
