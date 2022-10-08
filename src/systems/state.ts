import createState from 'zustand';
import { DEFAULTS } from '../game/defaults';
import { Action, TakeResourceAction } from './action';
import { Farm } from './farm';
import { ResourceMap } from './resource';
import { Round } from './round';

interface PlayerState {
    farm: Farm;
    numFamilyMembers: number;
    remainingActions: number;
    resources: ResourceMap;
}

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
}

export const useStore = createState<State>((set) => ({
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
        new TakeResourceAction('Travelling Players', 'food', 2),
        new TakeResourceAction('3 Wood', 'wood', 3, true),
        new TakeResourceAction('1 Clay', 'clay', 1, true),
        new TakeResourceAction('1 Reed', 'reed', 1, true),
        new TakeResourceAction('Fishing Pond', 'food', 1, true),
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
            const resourceUpdate = action.performAction(
                state.player.farm,
                state.player.resources
            );

            return {
                player: {
                    ...state.player,
                    remainingActions: state.player.remainingActions - 1,
                    resources: {
                        ...state.player.resources,
                        ...resourceUpdate,
                    },
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
}));
