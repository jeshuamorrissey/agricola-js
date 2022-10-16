import { Action } from './actions/action';
import { ResourceMap } from './resource';
import { PlayerState } from './state/state.player';

export type OccupationCostFn = (player: PlayerState) => Partial<ResourceMap>;
export type OccupationCanPlayFn = (player: PlayerState) => boolean;
export type ModifyCostFn = (action: Action) => Partial<ResourceMap>;
export type BonusResourcesFn = (
    action: Action,
    amount: Partial<ResourceMap>
) => Partial<ResourceMap>;

export interface OccupationProps {
    name: string;
    description: string;
    canPlay?: OccupationCanPlayFn;
    cost?: OccupationCostFn;

    modifyCost?: ModifyCostFn;
    bonusResources?: BonusResourcesFn;
}

export class Occupation {
    private readonly __name: string;
    private readonly __description: string;
    private readonly __costFn?: OccupationCostFn;
    private readonly __canPlayFn?: OccupationCanPlayFn;
    private readonly __bonusResourcesFn?: BonusResourcesFn;

    constructor({
        name,
        description,
        cost,
        canPlay,
        bonusResources,
    }: OccupationProps) {
        this.__name = name;
        this.__description = description;
        this.__costFn = cost;
        this.__canPlayFn = canPlay;
        this.__bonusResourcesFn = bonusResources;
    }

    get name(): string {
        return this.__name;
    }

    get description(): string {
        return this.__description;
    }

    cost(player: PlayerState): Partial<ResourceMap> {
        return this.__costFn ? this.__costFn(player) : {};
    }

    canPlay(player: PlayerState): boolean {
        return this.__canPlayFn ? this.__canPlayFn(player) : true;
    }

    bonusResources(
        action: Action,
        amount: Partial<ResourceMap>
    ): Partial<ResourceMap> {
        if (this.__bonusResourcesFn) {
            return this.__bonusResourcesFn(action, amount);
        }

        return {};
    }
}
