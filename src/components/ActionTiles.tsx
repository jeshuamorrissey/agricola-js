import { useCallback } from 'react';
import { Action } from '../systems/actions/action';
import { useStore } from '../systems/state/useStore';

export type ActionsByStage = Record<number, Action[]>;
export type ActionOnClickFn = (action: Action) => void;

export interface ActionTilesComponentProps {
    availableActions: ActionsByStage;
}

export function ActionTilesComponent({
    availableActions,
}: ActionTilesComponentProps) {
    return (
        <div>
            {Object.entries(availableActions).map(([stageId, actions]) => (
                <ActionRowComponent
                    key={`action-row-${stageId}`}
                    actions={actions}
                    stageId={Number.parseInt(stageId)}
                />
            ))}
        </div>
    );
}

interface ActionRowComponentProps {
    actions: Action[];
    stageId: number;
}

function ActionRowComponent({ actions, stageId }: ActionRowComponentProps) {
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
                    action={action}
                />
            ))}
        </div>
    );
}

interface ActionTileComponentProps {
    action: Action;
}

function ActionTileComponent({ action }: ActionTileComponentProps) {
    const { player, isInHarvest, executeAction } = useStore((state) => ({
        player: state.player,
        isInHarvest: state.isInHarvest,
        executeAction: state.executeAction,
    }));

    const getBackgroundColor = useCallback(() => {
        if (player.inputRequest || isInHarvest || !action.canExecute(player)) {
            return 'grey';
        }

        return '';
    }, [isInHarvest, player, action]);

    const onActionClicked = useCallback(() => {
        if (player.inputRequest || isInHarvest || !action.canExecute(player)) {
            return;
        }

        executeAction(action);
    }, [isInHarvest, player, action, executeAction]);

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
            {action.name}
        </div>
    );
}
