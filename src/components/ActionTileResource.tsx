import { Resource, ResourceMap } from '../systems/resource';
import { ActionTileCost } from './ActionTileCost';

interface ResourceCost {
    resource: Resource;
    cost: number;
}

const RESOURCE_TO_EMOJI: Record<Resource, string> = {
    wood: '🪵',
    clay: '🧱',
    stone: '🪨',
    reed: '🎋',
    grain: '🌾',
    vegetables: '🥕',
    sheep: '🐑',
    boar: '🐗',
    cow: '🐄',
    food: '🍽️',
};

export interface ActionTileResourceProps {
    resource: Resource;
    amount: number;
    bonus?: Partial<ResourceMap>;
}

export function ActionTileResource({
    resource,
    amount,
    bonus,
}: ActionTileResourceProps) {
    return (
        <>
            <span>
                {'+'}
                {amount}
                {RESOURCE_TO_EMOJI[resource]}
                {bonus && (
                    <ActionTileCost
                        bonus={true}
                        cost={bonus}
                        costPerTileName={undefined}
                    />
                )}
            </span>
        </>
    );
}
