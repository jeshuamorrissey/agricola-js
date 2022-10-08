import { Farm } from '../systems/farm';
import { ResourceMap } from '../systems/resource';
import { BuildAction, BuildActionCallbackFn } from '../systems/state-player';
import {
    ActionOnClickFn,
    ActionsByStage,
    ActionTilesComponent,
} from './ActionTiles';
import { FarmComponent } from './Farm';
import { ResourceInformationComponent } from './ResourceInformation';

export interface PlayerDisplayProps {
    farm: Farm;
    resources: ResourceMap;
    availableActions: ActionsByStage;

    // Information about the current state of play.
    inHarvest: boolean;
    gameOver: boolean;
    remainingActions: number;
    round: number;
    stage: number;

    // Callbacks.
    onClickActionTile: ActionOnClickFn;
    onHarvestTriggered: () => void;

    // Requests for information. Will be defined if request is active.
    buildRequest?: BuildAction;
    buildResponse?: BuildActionCallbackFn;
}

export function PlayerDisplay({
    farm,
    resources,
    availableActions,
    inHarvest,
    gameOver,
    remainingActions,
    round,
    stage,
    onClickActionTile,
    onHarvestTriggered,
    buildRequest,
    buildResponse,
}: PlayerDisplayProps) {
    return (
        <div>
            <div>{gameOver ? 'game over!' : ''}</div>
            <div>{`actions remaining: ${remainingActions}`}</div>
            <div>{`round: ${round}, stage: ${stage}`}</div>
            <ResourceInformationComponent resources={resources} />
            {inHarvest && (
                <button onClick={onHarvestTriggered}>Trigger Harvest</button>
            )}
            {!gameOver && (
                <ActionTilesComponent
                    availableActions={availableActions}
                    disableRoundActions={
                        inHarvest || buildRequest !== undefined
                    }
                    onClick={onClickActionTile}
                />
            )}
            <FarmComponent
                farm={farm}
                buildRequest={buildRequest}
                buildResponse={buildResponse}
            />
        </div>
    );
}
