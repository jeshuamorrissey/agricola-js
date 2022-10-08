import { Resource, ResourceMap } from '../systems/resource';

export interface ResourceInformationComponentProps {
    resources: ResourceMap;
}

export function ResourceInformationComponent({
    resources,
}: ResourceInformationComponentProps) {
    return (
        <div
            style={{
                display: 'flex',
            }}
        >
            {Object.entries(resources).map(([resource, quantity]) => {
                return (
                    <ResourceInformationTileComponent
                        key={`${resource}`}
                        resource={resource as Resource}
                        quantity={quantity}
                    />
                );
            })}
        </div>
    );
}

interface ResourceInformationTileComponentProps {
    resource: Resource;
    quantity: number;
}

function ResourceInformationTileComponent({
    resource,
    quantity,
}: ResourceInformationTileComponentProps) {
    return (
        <div
            style={{
                margin: '10px',
            }}
        >{`${resource}: ${quantity}`}</div>
    );
}
