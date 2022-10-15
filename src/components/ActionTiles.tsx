import { useCallback } from 'react';
import { Action } from '../systems/actions/action';
import { MultiAction } from '../systems/actions/multi-action';
import {
    TakeResourceAccumulatingAction,
    TakeResourceAction,
} from '../systems/actions/take-resource';
import { useStore } from '../systems/state/useStore';
import { ActionTileCost } from './ActionTileCost';
import { ActionTileResource } from './ActionTileResource';

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

    let displayActions = [action];
    if (action instanceof MultiAction) {
        displayActions = action.actions;
    }

    return (
        <div
            style={{
                border: 'green solid 1px',
                width: '9rem',
                height: '12rem',
                margin: '10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                textAlign: 'center',
                backgroundColor: getBackgroundColor(),
            }}
            onClick={onActionClicked}
        >
            {displayActions.map((action, idx) => {
                let suffix = <></>;
                if (idx !== displayActions.length - 1) {
                    suffix = (
                        <div>
                            <span>and/or</span>
                        </div>
                    );
                }

                let resourceCost = <></>;
                if (action instanceof TakeResourceAction) {
                    resourceCost = (
                        <ActionTileResource
                            resource={action.resource}
                            amount={action.quantity}
                        />
                    );
                } else {
                    resourceCost = (
                        <ActionTileCost
                            cost={action.getCost(player)}
                            costPerTileName={action.costPerTileName()}
                        />
                    );
                }

                let accumulatesNotice = <></>;
                if (action instanceof TakeResourceAccumulatingAction) {
                    accumulatesNotice = (
                        <div
                            style={{
                                fontStyle: 'italic',
                            }}
                        >
                            accumulates
                        </div>
                    );
                }

                return (
                    <>
                        <div style={{ fontWeight: 'bold' }}>{action.name}</div>
                        {accumulatesNotice}
                        {resourceCost}
                        {suffix}
                    </>
                );
            })}
        </div>
    );
}
