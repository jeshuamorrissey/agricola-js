import { Farm } from './farm';
import { Resource, ResourceMap } from './resource';

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

    performAction(_farm: Farm, _resources: ResourceMap): Partial<ResourceMap> {
        this.used = true;
        return {};
    }

    advanceRound() {
        this.used = false;
    }
}

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

    override performAction(
        board: Farm,
        resources: ResourceMap
    ): Partial<ResourceMap> {
        super.performAction(board, resources);
        const newQuantity = resources[this.resource] + this.currentQuantity;
        if (this.accumulates) {
            this.currentQuantity = 0;
        }
        return {
            [this.resource]: newQuantity,
        };
    }

    override advanceRound() {
        super.advanceRound();
        if (this.accumulates) {
            this.currentQuantity += this.quantity;
        }
    }
}
