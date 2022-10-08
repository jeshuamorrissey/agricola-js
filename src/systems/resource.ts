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
