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

export interface ActionTileCostProps {
    cost: Partial<ResourceMap>;
    costPerTileName: string | undefined;
}

export function ActionTileCost({ cost, costPerTileName }: ActionTileCostProps) {
    const resourceCosts: ResourceCost[] = [];
    for (const resource in cost) {
        const resourceCost = cost[resource as Resource];
        if (!resourceCost) {
            continue;
        }

        resourceCosts.push({
            resource: resource as Resource,
            cost: resourceCost,
        });
    }

    return (
        <div>
            {resourceCosts.map((cost, idx) => {
                let suffix = '';
                if (idx !== resourceCosts.length - 1) {
                    suffix = ' + ';
                }

                return (
                    <>
                        <span>
                            {cost.cost}
                            {RESOURCE_TO_EMOJI[cost.resource]}
                            {suffix}
                        </span>
                    </>
                );
            })}
            <br />
            <span
                style={{
                    fontStyle: 'italic',
                }}
            >
                {resourceCosts.length > 0 && costPerTileName
                    ? ` per ${costPerTileName}`
                    : ''}
            </span>
        </div>
    );
}
