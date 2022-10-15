import {
    InputRequest,
    PlayerState,
    PlayerStateUpdateFn,
} from '../state/state.player';
import { Action, ActionProps } from './action';

export type MultiActionMode = 'and-or' | 'or' | 'after';

export interface MultiActionProps {
    actions: Action[];
    mode: MultiActionMode;
}

export class MultiAction extends Action {
    private readonly __actions: Action[];
    private readonly __mode: MultiActionMode;

    private __nextAction = 0;

    constructor({ actions, mode, ...props }: MultiActionProps & ActionProps) {
        super(props);

        this.__actions = actions;
        this.__mode = mode;
    }

    get actionsComplete(): boolean {
        return this.__actions[this.__nextAction] === undefined;
    }

    get nextAction(): Action {
        return this.__actions[this.__nextAction];
    }

    execute(
        player: PlayerState,
        updatePlayerFn: PlayerStateUpdateFn
    ): InputRequest | undefined {
        while (this.nextAction && !this.nextAction.canExecute(player)) {
            this.__nextAction++;
        }

        if (this.nextAction) {
            return this.nextAction.execute(player, (updater) => {
                this.__nextAction++;
                updatePlayerFn(updater);
            });
        } else {
            updatePlayerFn(() => {});
        }
    }

    canExecute(player: PlayerState): boolean {
        if (this.__mode === 'and-or' || this.__mode === 'or') {
            return this.__actions.some((action) => action.canExecute(player));
        }

        return this.__actions[0].canExecute(player);
    }

    advanceRound() {
        this.__nextAction = 0;
        for (const action of this.__actions) {
            action.advanceRound();
        }
    }
}
