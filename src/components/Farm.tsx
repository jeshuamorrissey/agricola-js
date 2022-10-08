import { Farm, FarmTile } from '../systems/farm';

export interface FarmComponentProps {
    farm: Farm;
}

export function FarmComponent({ farm }: FarmComponentProps) {
    return (
        <div>
            {farm.getTiles().map((row, idx) => {
                return <FarmRowComponent key={`farm-row-${idx}`} tiles={row} />;
            })}
        </div>
    );
}

interface FarmRowComponentProps {
    tiles: FarmTile[];
}

function FarmRowComponent({ tiles }: FarmRowComponentProps) {
    return (
        <div
            style={{
                border: 'red solid 1px',
                display: 'flex',
            }}
        >
            {tiles.map((tile, idx) => {
                return <FarmTileComponent key={`tile-${idx}`} tile={tile} />;
            })}
        </div>
    );
}

interface FarmTileComponentProps {
    tile: FarmTile;
}

function FarmTileComponent({ tile }: FarmTileComponentProps) {
    return (
        <div
            style={{
                border: 'blue solid 1px',
                width: '9rem',
                height: '9rem',
                margin: '10px',
            }}
        >
            {tile}
        </div>
    );
}
