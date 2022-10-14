import { useCallback } from 'react';
import { Action } from '../systems/actions/action';
import { useStore } from '../systems/state/useStore';

export type ActionsByStage = Record<number, (Action | Action[])[]>;
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
    actions: (Action | Action[])[];
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
    action: Action | Action[];
}

function ActionTileComponent({ action }: ActionTileComponentProps) {
    const { player, isInHarvest, executeNextAction, setActionQueue } = useStore(
        (state) => ({
            player: state.player,
            isInHarvest: state.isInHarvest,
            executeNextAction: state.executeNextAction,
            setActionQueue: state.setActionQueue,
        })
    );

    const getBackgroundColor = useCallback(() => {
        // if (player.inputRequest || isInHarvest || !action.canExecute(player)) {
        //     return 'grey';
        // }

        return '';
    }, [isInHarvest, player, action]);

    const onActionClicked = useCallback(() => {
        // if (player.inputRequest || isInHarvest || !action.canExecute(player)) {
        //     return;
        // }

        if (action instanceof Action) {
            setActionQueue([action]);
        } else {
            setActionQueue(action);
        }

        executeNextAction();
    }, [isInHarvest, player, action, executeNextAction, setActionQueue]);

    let name;
    if (action instanceof Action) {
        name = action.name;
    } else {
        for (const a of action) {
            if (name) {
                name = `${name} + ${a.name}`;
            } else {
                name = a.name;
            }
        }
    }

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
            {name}
        </div>
    );
}
