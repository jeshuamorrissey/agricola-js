import { Farm, FarmCoordinate, FarmTile } from '../farm';
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

export interface InputRequestBase {
    id: string;
    actionName: string;
}

export type InputRequest = FarmTileInputRequest;

export interface FarmTileInputRequest extends InputRequestBase {
    id: 'farm-tile-input-request';
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

export function isFarmTileInputRequest(
    request?: InputRequest
): request is FarmTileInputRequest {
    return request ? request.id === 'farm-tile-input-request' : false;
}
