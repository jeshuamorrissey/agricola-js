export type Resource =
    | 'wood'
    | 'clay'
    | 'stone'
    | 'reed'
    | 'grain'
    | 'vegetables'
    | 'sheep'
    | 'boar'
    | 'cow'
    | 'food';

export type ResourceMap = Record<Resource, number>;

export function canAfford(
    availableResources: ResourceMap,
    cost: Partial<ResourceMap>
): boolean {
    for (const key in cost) {
        if (
            availableResources[key as Resource] < (cost[key as Resource] || 0)
        ) {
            return false;
        }
    }

    return true;
}

export function payResources(
    availableResources: ResourceMap,
    cost: Partial<ResourceMap>
): ResourceMap {
    const newResources = { ...availableResources };
    for (const key in cost) {
        newResources[key as Resource] -= cost[key as Resource] || 0;
    }

    return newResources;
}

export function giveResources(
    resources: ResourceMap,
    payment: Partial<ResourceMap>
): ResourceMap {
    const newResources = { ...resources };
    for (const key in payment) {
        newResources[key as Resource] += payment[key as Resource] || 0;
    }

    return newResources;
}

export function maxNumPurchases(
    availableResources: ResourceMap,
    payment: Partial<ResourceMap>
): number {
    let numPurchases = Infinity;
    console.log(payment);
    for (const resourceStr in payment) {
        const resource = resourceStr as Resource;
        const numPurchasesForResource = Math.floor(
            availableResources[resource] / (payment[resource] || 0)
        );

        numPurchases = Math.min(numPurchasesForResource, numPurchases);
    }

    return numPurchases;
}
