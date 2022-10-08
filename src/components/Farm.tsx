import { useCallback } from 'react';
import { Farm, FarmTile } from '../systems/farm';
import { BuildAction, BuildActionCallbackFn } from '../systems/state-player';

export interface FarmComponentProps {
    farm: Farm;
    buildRequest?: BuildAction;
    buildResponse?: BuildActionCallbackFn;
}

export function FarmComponent({
    farm,
    buildRequest,
    buildResponse,
}: FarmComponentProps) {
    const onClick = useCallback(
        (row: number, column: number) => {
            buildResponse && buildResponse(row, column);
        },
        [buildRequest, buildResponse]
    );

    return (
        <div>
            {buildRequest !== undefined && (
                <p>
                    Please select a tile of type{' '}
                    {buildRequest.request.possibleTileTypes}
                </p>
            )}
            {farm.getTiles().map((row, idx) => {
                return (
                    <FarmRowComponent
                        key={`farm-row-${idx}`}
                        tiles={row}
                        row={idx}
                        highlightTileTypes={
                            buildRequest?.request.possibleTileTypes || []
                        }
                        onClick={onClick}
                    />
                );
            })}
        </div>
    );
}

interface FarmRowComponentProps {
    tiles: FarmTile[];
    row: number;
    highlightTileTypes: FarmTile[];
    onClick?: (row: number, col: number) => void;
}

function FarmRowComponent({
    tiles,
    row,
    onClick,
    highlightTileTypes,
}: FarmRowComponentProps) {
    return (
        <div
            style={{
                border: 'red solid 1px',
                display: 'flex',
            }}
        >
            {tiles.map((tile, idx) => {
                return (
                    <FarmTileComponent
                        key={`tile-${idx}`}
                        tile={tile}
                        row={row}
                        col={idx}
                        disable={
                            highlightTileTypes.length > 0 &&
                            highlightTileTypes.indexOf(tile) === -1
                        }
                        onClick={onClick}
                    />
                );
            })}
        </div>
    );
}

interface FarmTileComponentProps {
    tile: FarmTile;
    row: number;
    col: number;
    onClick?: (row: number, col: number) => void;
    disable?: boolean;
}

function FarmTileComponent({
    tile,
    row,
    col,
    onClick,
    disable,
}: FarmTileComponentProps) {
    return (
        <div
            style={{
                border: 'blue solid 1px',
                width: '9rem',
                height: '9rem',
                margin: '10px',
                backgroundColor: disable ? 'grey' : '',
            }}
            onClick={() => !disable && onClick && onClick(row, col)}
        >
            {tile}
        </div>
    );
}
