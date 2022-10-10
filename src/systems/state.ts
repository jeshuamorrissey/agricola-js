import createState from 'zustand';
import { DEFAULTS } from '../game/defaults';
import { Action } from './actions/action';
import { ANY_NUMBER, BuildOnFarmAction } from './actions/build-on-farm';
import { TakeResourceAction } from './actions/take-resource';
import { Farm } from './farm';
import { Round } from './round';
import { InputRequest, PlayerState } from './state-player';

interface State {
    // Information for the various players. For now, only make it one player.
    player: PlayerState;

    // Static state.
    defaultActions: Action[];
    rounds: Round[];

    // Keep track of the progress through the game.
    currentRound: number;

    // State toggles.
    isGameOver: boolean;
    isInHarvest: boolean;

    // Mutation functions.
    executeActionTile: (action: Action) => void;
    advanceRound: () => void;
    harvest: () => void;
    // setBuildResponse: (row: number, column: number) => void;
    makeInputRequest: (request: InputRequest) => void;
    cancelInputRequest: () => void;
    updatePlayer: (updater: (player: PlayerState) => void) => void;
}

export const useStore = createState<State>((set, get) => ({
    updatePlayer: (updater: (player: PlayerState) => void) => {
        set((state) => {
            updater(state.player);
            return {
                player: {
                    ...state.player,
                },
            };
        });
    },
    player: {
        farm: new Farm(
            DEFAULTS.farmSize.width,
            DEFAULTS.farmSize.height,
            DEFAULTS.initFarm
        ),
        numFamilyMembers: DEFAULTS.numFamilyMembers,
        remainingActions: DEFAULTS.numFamilyMembers,
        resources: DEFAULTS.resources,
    },

    defaultActions: [
        new BuildOnFarmAction(
            'Build Stable(s)',
            { wood: 2 },
            'stable',
            'empty',
            Infinity
        ),
        new TakeResourceAction('3 Wood', 'wood', 3, true),
        new TakeResourceAction('1 Clay', 'clay', 1, true),
        new TakeResourceAction('1 Reed', 'reed', 1, true),
        new TakeResourceAction('Fishing Pond', 'food', 1, true),
        new TakeResourceAction('Take 1 Grain', 'grain', 1),
        new BuildOnFarmAction('Plow 1 Field', {}, 'field', 'empty', 2),
        new TakeResourceAction('Day Laborer', 'food', 2),
    ],
    rounds: DEFAULTS.rounds,

    currentRound: 0,

    isGameOver: false,
    isInHarvest: false,

    harvest: () => {
        set((state) => {
            const newFood = (state.player.resources['food'] -=
                state.player.numFamilyMembers *
                DEFAULTS.foodPerFamilyAtHarvest);

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
        });
    },

    executeActionTile: (action: Action) => {
        if (action.hasBeenUsed()) {
            return;
        }

        set((state) => {
            let remainingActions = state.player.remainingActions;
            if (action.prepare(state.player)) {
                if (action.performAction(state.player)) {
                    remainingActions -= 1;
                    action.postAction(state.player);
                }
            }

            return {
                player: {
                    ...state.player,
                    remainingActions: remainingActions,
                },
            };
        });

        set((state) => {
            if (state.player.remainingActions === 0) {
                state.advanceRound();
            }

            return {};
        });
    },

    advanceRound: () => {
        set((state) => {
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
        });
    },

    // setBuildResponse: (row: number, column: number) => {
    //     set((state) => {
    //         if (!state.player.buildAction) {
    //             return {};
    //         }

    //         return {
    //             player: {
    //                 ...state.player,
    //                 buildAction: {
    //                     ...state.player.buildAction,
    //                     response: [
    //                         {
    //                             row,
    //                             column,
    //                         },
    //                     ],
    //                 },
    //             },
    //         };
    //     });

    //     set((state) => {
    //         if (state.player.buildAction) {
    //             state.executeActionTile(
    //                 state.player.buildAction?.request.action
    //             );
    //         }

    //         return {};
    //     });
    // },

    makeInputRequest: (request) => {
        set((state) => {
            return {
                player: {
                    ...state.player,
                    inputRequest: request,
                },
            };
        });
    },

    cancelInputRequest: () => {
        set((state) => {
            return {
                player: {
                    ...state.player,
                    inputRequest: undefined,
                },
            };
        });
    },
}));
