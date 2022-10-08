import { Farm } from '../farm';
import { Resource, ResourceMap } from '../resource';
import { PlayerState } from '../state-player';
import { Action } from './action';

export class TakeResourceAction extends Action {
    private currentQuantity: number;
    constructor(
        name: string,
        private readonly resource: Resource,
        private readonly quantity: number,
        private readonly accumulates: boolean = false
    ) {
        super(name);

        this.currentQuantity = quantity;
    }

    override getName() {
        return `${super.getName()} (${this.currentQuantity})`;
    }

    override performAction(state: PlayerState) {
        super.performAction(state);

        const newQuantity =
            state.resources[this.resource] + this.currentQuantity;
        if (this.accumulates) {
            this.currentQuantity = 0;
        }

        state.resources[this.resource] = newQuantity;
        return true;
    }

    override advanceRound() {
        super.advanceRound();
        if (this.accumulates) {
            this.currentQuantity += this.quantity;
        }
    }
}
