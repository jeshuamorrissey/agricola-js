import { Action } from './actions/action';
import { Farm, FarmTile } from './farm';
import { ResourceMap } from './resource';

export type BuildActionCallbackFn = (row: number, column: number) => void;

export interface BuildAction {
    request: {
        action: Action;
        possibleTileTypes: FarmTile[];
    };

    response?: {
        row: number;
        column: number;
    };
}

export interface PlayerState {
    farm: Farm;
    numFamilyMembers: number;
    remainingActions: number;
    resources: ResourceMap;

    // State used to describe what to do for specific actions.
    buildAction?: BuildAction;
}
