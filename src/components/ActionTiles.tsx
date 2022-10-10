import { useCallback } from 'react';
import { Action } from '../systems/actions/action';
import { useStore } from '../systems/state';

export type ActionsByStage = Record<number, Action[]>;
export type ActionOnClickFn = (action: Action) => void;

export interface ActionTilesComponentProps {
    availableActions: ActionsByStage;
    disableRoundActions: boolean;
    onClick: ActionOnClickFn;
}

export function ActionTilesComponent({
    availableActions,
    disableRoundActions,
    onClick,
}: ActionTilesComponentProps) {
    return (
        <div>
            {Object.entries(availableActions).map(([stageId, actions]) => (
                <ActionRowComponent
                    key={`action-row-${stageId}`}
                    actions={actions}
                    stageId={Number.parseInt(stageId)}
                    onClick={onClick}
                    disabled={disableRoundActions}
                />
            ))}
        </div>
    );
}

interface ActionRowComponentProps {
    actions: Action[];
    stageId: number;
    disabled: boolean;
    onClick: ActionOnClickFn;
}

function ActionRowComponent({
    actions,
    stageId,
    disabled,
    onClick,
}: ActionRowComponentProps) {
    return (
        <div
            style={{
                display: 'flex',
                border: 'orange solid 1px',
            }}
        >
            {actions.map((action, tileIdx) => (
                <ActionTileComponent
                    key={`action-tile-${stageId}-${tileIdx}`}
                    disabled={disabled}
                    onClick={onClick}
                    action={action}
                />
            ))}
        </div>
    );
}

interface ActionTileComponentProps {
    action: Action;
    disabled: boolean;
    onClick: ActionOnClickFn;
}

function ActionTileComponent({ action }: ActionTileComponentProps) {
    const {
        isInHarvest,
        resources,
        makeInputRequest,
        executeActionTile,
        updatePlayer,
    } = useStore((state) => ({
        isInHarvest: state.isInHarvest,
        resources: state.player.resources,
        makeInputRequest: state.makeInputRequest,
        executeActionTile: state.executeActionTile,
        updatePlayer: state.updatePlayer,
    }));

    const getBackgroundColor = useCallback(() => {
        if (isInHarvest || !action.canBeRun(resources)) {
            return 'grey';
        } else if (action.hasBeenUsed()) {
            return 'red';
        }

        return '';
    }, [resources, action]);

    const onActionClicked = useCallback(() => {
        if (isInHarvest || !action.canBeRun(resources)) {
            return;
        }

        const inputRequest = action.inputRequest(updatePlayer);
        if (inputRequest) {
            makeInputRequest(inputRequest);
            return;
        }

        executeActionTile(action);
    }, [resources, action, makeInputRequest, executeActionTile]);

    return (
        <div
            style={{
                border: 'green solid 1px',
                width: '9rem',
                height: '12rem',
                margin: '10px',
                backgroundColor: getBackgroundColor(),
            }}
            onClick={onActionClicked}
        >
            {action.getName()}
        </div>
    );
}
