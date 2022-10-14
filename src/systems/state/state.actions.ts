import { DEFAULTS } from '../../game/defaults';
import { Action } from '../actions/action';
import { payResources } from '../resource';
import { State, StateGetter, StateSetter } from './state.model';
import { InputRequest } from './state.player';

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

export function executeNextAction(get: StateGetter, set: StateSetter) {
    let action = get().player.actionSequence[0];
    console.log('got here', action);
    if (!action) {
        console.log('got here');
        return;
    }

    set((state) => {
        state.player.actionSequence.shift();
        return {
            player: {
                ...state.player,
                actionSequence: [...state.player.actionSequence.slice(1)],
            },
        };
    });

    // Execute the command.
    const inputRequests = action.execute((updateFn) => {
        set((state) => {
            action.used = true;
            updateFn(state.player);

            if (state.player.actionSequence.length > 0) {
                console.log('executing next action');
                state.executeNextAction();

                return {
                    player: {
                        ...state.player,
                    },
                };
            }

            return {
                player: {
                    ...state.player,
                    remainingActions: state.player.remainingActions - 1,
                    inputRequests: undefined,
                },
            };
        });
    });

    if (inputRequests && inputRequests.length > 0) {
        set((state) => {
            return {
                player: {
                    ...state.player,
                    inputRequests,
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

    for (const actionSet of state.defaultActions) {
        if (actionSet instanceof Action) {
            actionSet.advanceRound();
        } else {
            for (const action of actionSet) {
                action.advanceRound();
            }
        }
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
