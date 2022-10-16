import React from 'react';
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
    bonus?: boolean;
}

export function ActionTileCost({
    cost,
    costPerTileName,
    bonus = false,
}: ActionTileCostProps) {
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

                let prefix = <span></span>;
                if (bonus) {
                    prefix = (
                        <span style={{ fontStyle: 'italic' }}>Bonus: +</span>
                    );
                }

                return (
                    <React.Fragment key={`action-tile-cost-${idx}`}>
                        <span>
                            {prefix}
                            {cost.cost}
                            {RESOURCE_TO_EMOJI[cost.resource]}
                            {suffix}
                        </span>
                    </React.Fragment>
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
