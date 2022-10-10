import { Action } from '../actions/action';
import { Round } from '../round';
import { InputRequest, PlayerState } from './state.player';

export type StateSetter = (
    partial:
        | State
        | Partial<State>
        | ((state: State) => State | Partial<State>),
    replace?: boolean | undefined
) => void;

export interface State {
    // Information for the various players. For now, only make it one player.
    player: PlayerState;

    // Static state.
    defaultActions: Action[];
    rounds: Round[];

    // Keep track of the progress through the game.
    currentRound: number;

    // State toggles.
    isGameOver: boolean;
    isInHarvest: boolean;

    // Mutation functions.
    executeActionTile: (action: Action) => void;
    advanceRound: () => void;
    harvest: () => void;
    cancelInputRequest: () => void;
}
