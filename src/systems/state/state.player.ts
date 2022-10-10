import { Farm, FarmCoordinate } from '../farm';
import { ResourceMap } from '../resource';

export type PlayerStateUpdateFn = (
    updateFn: (player: PlayerState) => void
) => void;

export interface PlayerState {
    farm: Farm;
    numFamilyMembers: number;
    remainingActions: number;
    resources: ResourceMap;

    // State used to describe what to do for specific actions.
    inputRequest?: InputRequest;
}

export type InputRequest = FarmTileInputRequest;

export interface FarmTileInputRequest {
    minTiles: number;
    maxTiles: number;
    costPerTile: Partial<ResourceMap>;
    isValidTile: (
        farm: Farm,
        location: FarmCoordinate,
        selectedTiles: FarmCoordinate[]
    ) => boolean;
    onRequestSatisfied: (tiles: FarmCoordinate[]) => void;
}
