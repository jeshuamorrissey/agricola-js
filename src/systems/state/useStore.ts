import createState from 'zustand';
import { DEFAULTS } from '../../game/defaults';
import { Action } from '../actions/action';
import { BuildOnFarmAction } from '../actions/build-on-farm';
import { MultiAction } from '../actions/multi-action';
import {
    TakeResourceAccumulatingAction,
    TakeResourceAction,
} from '../actions/take-resource';
import { Farm } from '../farm';
import {
    advanceRound,
    cancelInputRequest,
    executeAction,
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
            amountToTake: 3,
        }),
        new TakeResourceAccumulatingAction({
            name: '1 Clay',
            resource: 'clay',
            amountToTake: 1,
        }),
        new TakeResourceAccumulatingAction({
            name: '1 Reed',
            resource: 'reed',
            amountToTake: 1,
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
            costPerTileName: 'field',
            isValidTile: (farm, { row, column }) => {
                return farm.getTile(row, column) === 'empty';
            },
            minTilesToBuild: 1,
            maxTilesToBuild: 1,
        }),
        new MultiAction({
            name: 'Build Room(s) and/or Build Stable(s)',
            mode: 'and-or',
            actions: [
                new BuildOnFarmAction({
                    name: 'Build Room(s)',
                    costPerTileName: 'room',
                    cost: (player) => {
                        switch (player.farm.getHouseType()) {
                            case 'wood-house':
                                return { wood: 5, reed: 2 };
                            case 'clay-house':
                                return { clay: 5, reed: 2 };
                            case 'stone-house':
                                return { stone: 5, reed: 2 };
                        }
                    },
                    tileToBuild: (player) => player.farm.getHouseType(),
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
                                .includes(farm.getHouseType())
                        );
                    },
                    minTilesToBuild: 0,
                    maxTilesToBuild: Infinity,
                }),
                new BuildOnFarmAction({
                    name: 'Build Stable(s)',
                    costPerTileName: 'stable',
                    cost: { wood: 2 },
                    tileToBuild: 'stable',
                    isValidTile: (farm, { row, column }) => {
                        return farm.getTile(row, column) === 'empty';
                    },
                    minTilesToBuild: 0,
                    maxTilesToBuild: Infinity,
                }),
            ],
        }),
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

    executeAction: (action: Action) => {
        executeAction(get, set, action);
    },

    advanceRound: () => {
        set(advanceRound);
    },

    cancelInputRequest: () => {
        set(cancelInputRequest);
    },
}));
