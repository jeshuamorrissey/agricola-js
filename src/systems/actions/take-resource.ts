import { giveResources, Resource } from '../resource';
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

    override execute(
        _: PlayerState,
        updatePlayerFn: PlayerStateUpdateFn
    ): undefined {
        updatePlayerFn((player) => {
            player.resources = giveResources(player.resources, {
                [this.resource]: this.amountToTake,
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

    override execute(
        _: PlayerState,
        updatePlayerFn: PlayerStateUpdateFn
    ): undefined {
        updatePlayerFn((player) => {
            player.resources[this.resource] += this.__currentQuantity;
            this.__currentQuantity = 0;
        });

        return undefined;
    }

    override advanceRound() {
        super.advanceRound();

        this.__currentQuantity += this.amountToTake;
    }
}
