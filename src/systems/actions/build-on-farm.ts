import { FarmTile } from '../farm';
import { PlayerState } from '../state-player';
import { Action } from './action';

export class BuildOnFarmAction extends Action {
    constructor(
        name: string,
        private readonly tileToBuild: FarmTile,
        private readonly requiredPreviousState: FarmTile = 'empty'
    ) {
        super(name);
    }

    override prepare(state: PlayerState): boolean {
        if (state.buildAction?.response) {
            return true;
        }

        state.buildAction = {
            request: {
                action: this,
                possibleTileTypes: [this.requiredPreviousState],
            },
        };

        return false;
    }

    override performAction(state: PlayerState): boolean {
        if (!state.buildAction?.response) {
            return false;
        }

        super.performAction(state);
        state.farm.setTile(
            state.buildAction?.response?.row,
            state.buildAction?.response?.column,
            this.tileToBuild
        );

        return true;
    }

    override postAction(state: PlayerState) {
        state.buildAction = undefined;
    }
}
