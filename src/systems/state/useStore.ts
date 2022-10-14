import createState from 'zustand';
import { DEFAULTS } from '../../game/defaults';
import { Action } from '../actions/action';
import { BuildOnFarmAction } from '../actions/build-on-farm';
import {
    TakeResourceAccumulatingAction,
    TakeResourceAction,
} from '../actions/take-resource';
import { Farm } from '../farm';
import {
    advanceRound,
    cancelInputRequest,
    executeNextAction,
    harvest,
} from './state.actions';
import { State } from './state.model';

export const useStore = createState<State>((set, get) => ({
    player: {
        farm: new Farm(
            DEFAULTS.farmSize.width,
            DEFAULTS.farmSize.height,
            DEFAULTS.initFarm
        ),
        numFamilyMembers: DEFAULTS.numFamilyMembers,
        remainingActions: DEFAULTS.numFamilyMembers,
        actionSequence: [],
        resources: DEFAULTS.resources,
    },

    defaultActions: [
        new TakeResourceAccumulatingAction({
            name: '3 Wood',
            resource: 'wood',
            amountToTake: 300,
        }),
        new TakeResourceAccumulatingAction({
            name: '1 Clay',
            resource: 'clay',
            amountToTake: 1,
        }),
        new TakeResourceAccumulatingAction({
            name: '1 Reed',
            resource: 'reed',
            amountToTake: 100,
        }),
        new TakeResourceAccumulatingAction({
            name: 'Fishing Pond',
            resource: 'food',
            amountToTake: 1,
        }),
        new TakeResourceAction({
            name: 'Take 1 Grain',
            resource: 'grain',
            amountToTake: 1,
        }),
        new TakeResourceAction({
            name: 'Day Laborer',
            resource: 'food',
            amountToTake: 2,
        }),
        new BuildOnFarmAction({
            name: 'Plow 1 Field',
            tileToBuild: 'field',
            isValidTile: (farm, { row, column }) => {
                return farm.getTile(row, column) === 'empty';
            },
            minTilesToBuild: 1,
            maxTilesToBuild: 1,
        }),
        [
            new BuildOnFarmAction({
                name: 'Build Stable(s)',
                cost: { wood: 2 },
                tileToBuild: 'stable',
                isValidTile: (farm, { row, column }) => {
                    return farm.getTile(row, column) === 'empty';
                },
                minTilesToBuild: 0,
                maxTilesToBuild: Infinity,
            }),
            new BuildOnFarmAction({
                name: 'Build Room(s)',
                cost: { wood: 5, reed: 2 },
                tileToBuild: 'wood-house',
                isValidTile: (farm, { row, column }, selectedTiles) => {
                    const adjacentSelectedTiles = selectedTiles.filter(
                        (location) => {
                            return (
                                (location.row === row - 1 &&
                                    location.column === column) ||
                                (location.row === row + 1 &&
                                    location.column === column) ||
                                (location.row === row &&
                                    location.column === column - 1) ||
                                (location.row === row &&
                                    location.column === column + 1)
                            );
                        }
                    );

                    return (
                        adjacentSelectedTiles.length > 0 ||
                        farm
                            .getAdjacentTiles(row, column)
                            .includes('wood-house')
                    );
                },
                minTilesToBuild: 0,
                maxTilesToBuild: Infinity,
            }),
        ],
    ],
    rounds: DEFAULTS.rounds,

    currentRound: 0,

    isGameOver: false,
    isInHarvest: false,

    harvest: () => {
        set(harvest);
    },

    setActionQueue: (actions: Action[]) => {
        set((state) => {
            return {
                player: {
                    ...state.player,
                    actionSequence: [...actions],
                },
            };
        });
    },

    executeNextAction: () => {
        executeNextAction(get, set);
    },

    advanceRound: () => {
        set(advanceRound);
    },

    cancelInputRequest: () => {
        set(cancelInputRequest);
    },
}));
