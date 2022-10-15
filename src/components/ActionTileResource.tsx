import { Resource, ResourceMap } from '../systems/resource';

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
}

export function ActionTileResource({
    resource,
    amount,
}: ActionTileResourceProps) {
    return (
        <>
            <span>
                {'+'}
                {amount}
                {RESOURCE_TO_EMOJI[resource]}
            </span>
        </>
    );
}
