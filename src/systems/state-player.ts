import { Action } from './actions/action';
import { Farm, FarmCoordinate, FarmTile } from './farm';
import { ResourceMap } from './resource';

export type BuildActionCallbackFn = (row: number, column: number) => void;

export interface BuildActionResponse {
    row: number;
    column: number;
}

export interface BuildAction {
    request: {
        action: Action;
        possibleTileTypes: FarmTile[];
        availableToBuild: number;
        // costPerTile: Partial<ResourceMap>;
    };

    response?: BuildActionResponse[];
}

export interface FarmTileInputRequest {
    minTiles: number;
    maxTiles: number;
    costPerTile: Partial<ResourceMap>;
    isValidTile: (farm: Farm, location: FarmCoordinate) => boolean;
    onRequestSatisfied: (tiles: FarmCoordinate[]) => void;
}

export type InputRequest = FarmTileInputRequest;

export interface PlayerState {
    farm: Farm;
    numFamilyMembers: number;
    remainingActions: number;
    resources: ResourceMap;

    // State used to describe what to do for specific actions.
    inputRequest?: InputRequest;
}
