import { Farm } from '../systems/farm';
import { ResourceMap } from '../systems/resource';
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
                    disableRoundActions={inHarvest}
                    onClick={onClickActionTile}
                />
            )}
            <FarmComponent farm={farm} />
        </div>
    );
}
