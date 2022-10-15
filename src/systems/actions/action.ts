import { ResourceMap, canAfford } from '../resource';
import {
    InputRequest,
    PlayerState,
    PlayerStateUpdateFn,
} from '../state/state.player';

export interface ActionProps {
    name: string;
    cost?:
        | Partial<ResourceMap>
        | ((player: PlayerState) => Partial<ResourceMap>);
}

export abstract class Action {
    private readonly __name: string;
    private readonly __cost:
        | Partial<ResourceMap>
        | ((player: PlayerState) => Partial<ResourceMap>);

    private __usedThisRound: boolean = false;

    constructor({ name, cost = {} }: ActionProps) {
        this.__name = name;
        this.__cost = cost;
    }

    get used(): boolean {
        return this.__usedThisRound;
    }

    set used(val: boolean) {
        this.__usedThisRound = val;
    }

    /**
     * Returns the name of the action.
     *
     * @returns The name of the action.
     */
    get name() {
        return this.__name;
    }

    /**
     * Modify the state to perform the action. Should return an InputRequest in the
     * case that some input data is required.
     * @param updatePlayerFn - A function which can be called with an update routine to
     *                         modify the state.
     * @returns An InputRequest if one is required, otherwise undefined.
     */
    abstract execute(
        player: PlayerState,
        updatePlayerFn: PlayerStateUpdateFn
    ): InputRequest | undefined;

    /**
     * Determine whether the given player can execute this action. This should return
     * true if they can, false otherwise.
     * @param player - The player to check.
     */
    canExecute(player: PlayerState): boolean {
        return canAfford(player.resources, this.getCost(player)) && !this.used;
    }

    getCost(player: PlayerState): Partial<ResourceMap> {
        if (this.__cost instanceof Function) {
            return this.__cost(player);
        }

        return this.__cost;
    }

    costPerTileName(): string | undefined {
        return undefined;
    }

    /**
     * Advance this action to the next round. Some actions change each round (such as
     * accumulating resources) so this will be called each time the round changes.
     */
    advanceRound() {
        this.__usedThisRound = false;
    }
}
