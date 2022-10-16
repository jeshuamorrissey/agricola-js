import {
    OccupationRequest,
    PlayerState,
    PlayerStateUpdateFn,
} from '../state/state.player';
import { Action } from './action';

export interface PlayOccupationProps {}

export class PlayOccupation extends Action {
    override execute(
        player: PlayerState,
        updatePlayerFn: PlayerStateUpdateFn
    ): OccupationRequest {
        return {
            id: 'occupation-request',
            actionName: 'Play Occupation',
            onRequestSatisfied: (occupation) => {
                updatePlayerFn((player) => {
                    player.availableOccupations =
                        player.availableOccupations.filter(
                            (o) => o !== occupation
                        );
                    player.playedOccupations.push(occupation);
                });
            },
        };
    }
}
