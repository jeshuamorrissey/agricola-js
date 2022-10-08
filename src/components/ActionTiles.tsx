import { Action } from '../systems/actions/action';

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

function ActionTileComponent({
    action,
    disabled,
    onClick,
}: ActionTileComponentProps) {
    let backgroundColor = '';
    if (disabled) {
        backgroundColor = 'grey';
    } else if (action.hasBeenUsed()) {
        backgroundColor = 'red';
    }

    return (
        <div
            style={{
                border: 'green solid 1px',
                width: '9rem',
                height: '12rem',
                margin: '10px',
                backgroundColor: backgroundColor,
            }}
            onClick={() => onClick(action)}
        >
            {action.getName()}
        </div>
    );
}
