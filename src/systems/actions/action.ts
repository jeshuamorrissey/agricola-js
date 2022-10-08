import { Farm } from '../farm';
import { ResourceMap } from '../resource';
import { PlayerState } from '../state-player';

export type InputTypeRequired = 'farm-tile';

export abstract class Action {
    private used: boolean = false;
    constructor(private readonly name: string) {}

    getName() {
        return this.name;
    }

    hasBeenUsed(): boolean {
        return this.used;
    }

    resetHasBeenUsed() {
        this.used = false;
    }

    prepare(state: PlayerState): boolean {
        return true;
    }

    performAction(state: PlayerState): boolean {
        this.used = true;
        return true;
    }

    postAction(state: PlayerState) {}

    advanceRound() {
        this.used = false;
    }
}
