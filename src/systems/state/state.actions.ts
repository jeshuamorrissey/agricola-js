import { DEFAULTS } from '../../game/defaults';
import { Action } from '../actions/action';
import { payResources } from '../resource';
import { State, StateSetter } from './state.model';

export function harvest(state: State) {
    const newFood = (state.player.resources['food'] -=
        state.player.numFamilyMembers * DEFAULTS.foodPerFamilyAtHarvest);

    if (state.currentRound === state.rounds.length - 1) {
        return {
            isInHarvest: false,
            isGameOver: true,
        };
    }

    return {
        isInHarvest: false,
        currentRound: state.currentRound + 1,
        player: {
            ...state.player,
            resources: {
                ...state.player.resources,
                food: newFood,
            },
        },
    };
}

export function executeAction(set: StateSetter, action: Action) {
    if (action.used) {
        return;
    }

    // Execute the command.
    const inputRequest = action.execute((updateFn) => {
        set((state) => {
            action.used = true;
            updateFn(state.player);
            return {
                player: {
                    ...state.player,
                    remainingActions: state.player.remainingActions - 1,
                    inputRequest: undefined,
                },
            };
        });
    });

    if (inputRequest) {
        set((state) => {
            return {
                player: {
                    ...state.player,
                    inputRequest,
                },
            };
        });
    }
}

export function advanceRound(state: State) {
    const nextRound = state.currentRound + 1;

    // Special case: we have just finished our last round, so don't
    //               increase the round number.
    if (nextRound >= state.rounds.length) {
        return { isInHarvest: true };
    }

    const currentRoundObj = state.rounds[state.currentRound];
    const nextRoundObj = state.rounds[nextRound];

    for (const action of state.defaultActions) {
        action.advanceRound();
    }

    for (const round of state.rounds) {
        round.newAction.advanceRound();
    }

    if (nextRoundObj.stage !== currentRoundObj.stage) {
        return {
            player: {
                ...state.player,
                remainingActions: state.player.numFamilyMembers,
            },
            isInHarvest: true,
        };
    }

    return {
        player: {
            ...state.player,
            remainingActions: state.player.numFamilyMembers,
        },
        currentRound: nextRound,
    };
}

export function cancelInputRequest(state: State) {
    return {
        player: {
            ...state.player,
            inputRequest: undefined,
        },
    };
}
