import { giveResources, Resource, ResourceMap } from '../resource';
import { PlayerState, PlayerStateUpdateFn } from '../state/state.player';
import { Action, ActionProps } from './action';

export interface TakeResourceActionProps {
    resource: Resource;
    amountToTake: number;
}

export class TakeResourceAction extends Action {
    private readonly __resource: Resource;
    private readonly __amountToTake: number;

    constructor({
        resource,
        amountToTake,
        ...props
    }: ActionProps & TakeResourceActionProps) {
        super(props);

        this.__resource = resource;
        this.__amountToTake = amountToTake;
    }

    get resource(): Resource {
        return this.__resource;
    }

    get amountToTake(): number {
        return this.__amountToTake;
    }

    get quantity(): number {
        return this.amountToTake;
    }

    amountToGet(): number {
        return this.amountToTake;
    }

    bonusResources(player: PlayerState): Partial<ResourceMap> {
        return super.bonusResources(player, {
            [this.resource]: this.amountToGet(),
        });
    }

    override execute(
        player: PlayerState,
        updatePlayerFn: PlayerStateUpdateFn
    ): undefined {
        updatePlayerFn((player) => {
            const bonusResources = this.bonusResources(player);
            player.resources = giveResources(player.resources, {
                ...bonusResources,
                [this.resource]:
                    this.amountToTake + (bonusResources[this.resource] || 0),
            });
        });

        return undefined;
    }
}

export class TakeResourceAccumulatingAction extends TakeResourceAction {
    private __currentQuantity;

    constructor(props: ActionProps & TakeResourceActionProps) {
        super(props);

        this.__currentQuantity = props.amountToTake;
    }

    override get quantity(): number {
        return this.__currentQuantity;
    }

    amountToGet(): number {
        return this.quantity;
    }

    override execute(
        _: PlayerState,
        updatePlayerFn: PlayerStateUpdateFn
    ): undefined {
        updatePlayerFn((player) => {
            const bonusResources = this.bonusResources(player);
            player.resources = giveResources(player.resources, {
                ...bonusResources,
                [this.resource]:
                    this.__currentQuantity +
                    (bonusResources[this.resource] || 0),
            });
            this.__currentQuantity = 0;
        });

        return undefined;
    }

    override advanceRound() {
        super.advanceRound();

        this.__currentQuantity += this.amountToTake;
    }
}
