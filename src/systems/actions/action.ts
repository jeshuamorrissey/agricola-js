import { Farm } from '../farm';
import { ResourceMap, Resource } from '../resource';
import { InputRequest, PlayerState } from '../state-player';

export type InputTypeRequired = 'farm-tile';

export abstract class Action {
    private used: boolean = false;
    constructor(
        private readonly name: string,
        private readonly cost: Partial<ResourceMap> = {}
    ) {}

    getName() {
        return this.name;
    }

    getCostForResource(resource: Resource) {
        return this.cost[resource] || 0;
    }

    canBeRun(resources: ResourceMap): boolean {
        for (const resource of Object.keys(this.cost)) {
            if (
                resources[resource as Resource] <
                this.getCostForResource(resource as Resource)
            ) {
                return false;
            }
        }

        return true;
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

    inputRequest(
        updatePlayer: (updater: (player: PlayerState) => PlayerState) => void
    ): InputRequest | undefined {
        return undefined;
    }
}
