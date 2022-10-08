import { TakeResourceAction } from '../systems/actions/take-resource';
import { Farm } from '../systems/farm';
import { ResourceMap } from '../systems/resource';
import { Round } from '../systems/round';

function defaultInitFarm(farm: Farm): void {
    farm.setTile(2, 0, 'wood-house');
    farm.setTile(1, 0, 'wood-house');
}

interface DefaultValues {
    initFarm: (farm: Farm) => void;

    foodPerFamilyAtHarvest: number;
    numFamilyMembers: number;
    resources: ResourceMap;
    farmSize: {
        width: number;
        height: number;
    };

    rounds: Round[];
}

export const DEFAULTS: DefaultValues = {
    initFarm: defaultInitFarm,
    foodPerFamilyAtHarvest: 3,
    numFamilyMembers: 2,
    resources: {
        wood: 0,
        clay: 0,
        stone: 0,
        reed: 0,
        grain: 0,
        vegetables: 0,
        food: 0,
        sheep: 0,
        boar: 0,
        cow: 0,
    },
    farmSize: {
        width: 5,
        height: 3,
    },
    rounds: [
        {
            stage: 1,
            newAction: new TakeResourceAction('Stage 1.1', 'food', 10, false),
        },
        {
            stage: 1,
            newAction: new TakeResourceAction('Stage 1.2', 'food', 10, false),
        },
        {
            stage: 1,
            newAction: new TakeResourceAction('Stage 1.3', 'food', 10, false),
        },
        {
            stage: 1,
            newAction: new TakeResourceAction('Stage 1.4', 'food', 10, false),
        },
        {
            stage: 2,
            newAction: new TakeResourceAction('Stage 2.1', 'food', 10, false),
        },
        {
            stage: 2,
            newAction: new TakeResourceAction('Stage 2.2', 'food', 10, false),
        },
        {
            stage: 2,
            newAction: new TakeResourceAction('Stage 2.3', 'food', 10, false),
        },
        {
            stage: 3,
            newAction: new TakeResourceAction('Stage 3.1', 'food', 10, false),
        },
        {
            stage: 3,
            newAction: new TakeResourceAction('Stage 3.2', 'food', 10, false),
        },
        {
            stage: 4,
            newAction: new TakeResourceAction('Stage 4.1', 'food', 10, false),
        },
        {
            stage: 4,
            newAction: new TakeResourceAction('Stage 4.2', 'food', 10, false),
        },
        {
            stage: 5,
            newAction: new TakeResourceAction('Stage 5.1', 'food', 10, false),
        },
        {
            stage: 5,
            newAction: new TakeResourceAction('Stage 5.2', 'food', 10, false),
        },
        {
            stage: 6,
            newAction: new TakeResourceAction('Stage 6.1', 'food', 10, false),
        },
    ],
};
