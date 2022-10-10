import { useCallback, useState } from 'react';
import { FarmCoordinate, FarmTile } from '../systems/farm';
import { maxNumPurchases } from '../systems/resource';
import { useStore } from '../systems/state/useStore';

export function FarmComponent() {
    const { inputRequest, farm, resources, cancelInputRequest } = useStore(
        (state) => ({
            farm: state.player.farm,
            resources: state.player.resources,
            inputRequest: state.player.inputRequest,
            cancelInputRequest: state.cancelInputRequest,
        })
    );

    const [selectedTiles, setSelectedTiles] = useState<
        { row: number; column: number }[]
    >([]);

    const maxBuildableTiles = useCallback(() => {
        if (!inputRequest) {
            return Infinity;
        }

        return Math.min(
            inputRequest.maxTiles,
            maxNumPurchases(resources, inputRequest.costPerTile)
        );
    }, [inputRequest, resources]);

    const onClick = useCallback(
        (row: number, column: number) => {
            if (!inputRequest) {
                return;
            }

            if (
                selectedTiles.some((l) => l.column === column && l.row === row)
            ) {
                setSelectedTiles((oldSelectedTiles) => {
                    return oldSelectedTiles.filter(
                        (t) => t.column !== column || t.row !== row
                    );
                });
            } else if (selectedTiles.length < maxBuildableTiles()) {
                setSelectedTiles((oldSelectedTiles) => {
                    return [...oldSelectedTiles, { row, column }];
                });
            }
        },
        [inputRequest, selectedTiles, setSelectedTiles]
    );

    const isSelected = useCallback(
        (location: FarmCoordinate) => {
            if (
                inputRequest &&
                selectedTiles.some(
                    (l) =>
                        l.column === location.column && l.row === location.row
                )
            ) {
                return true;
            }

            return false;
        },
        [inputRequest, selectedTiles, farm]
    );

    const isDisabled = useCallback(
        (location: FarmCoordinate) => {
            if (
                inputRequest &&
                !inputRequest.isValidTile(farm, location, selectedTiles)
            ) {
                return true;
            }

            return false;
        },
        [inputRequest, selectedTiles, farm]
    );

    return (
        <div>
            {inputRequest && selectedTiles.length >= inputRequest.minTiles && (
                <button
                    onClick={() => {
                        inputRequest.onRequestSatisfied(selectedTiles);
                        setSelectedTiles([]);
                    }}
                >
                    Finish Selection
                </button>
            )}
            {inputRequest && (
                <button
                    onClick={() => {
                        cancelInputRequest();
                        setSelectedTiles([]);
                    }}
                >
                    Cancel Action
                </button>
            )}
            {farm.getTiles().map((row, idx) => {
                return (
                    <FarmRowComponent
                        key={`farm-row-${idx}`}
                        tiles={row}
                        row={idx}
                        isDisabled={isDisabled}
                        isSelected={isSelected}
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
    isDisabled: (location: FarmCoordinate) => boolean;
    isSelected: (location: FarmCoordinate) => boolean;
    onClick: (row: number, col: number) => void;
}

function FarmRowComponent({
    tiles,
    row,
    onClick,
    isDisabled,
    isSelected,
}: FarmRowComponentProps) {
    return (
        <div
            style={{
                border: 'red solid 1px',
                display: 'flex',
            }}
        >
            {tiles.map((tile, idx) => {
                let backgroundColor = '';
                if (isDisabled({ row, column: idx })) {
                    backgroundColor = 'grey';
                } else if (isSelected({ row, column: idx })) {
                    backgroundColor = 'green';
                }

                return (
                    <FarmTileComponent
                        key={`tile-${idx}`}
                        tile={tile}
                        row={row}
                        col={idx}
                        backgroundColor={backgroundColor}
                        onClick={
                            isDisabled({ row, column: idx })
                                ? undefined
                                : onClick
                        }
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
    backgroundColor?: string;
}

function FarmTileComponent({
    tile,
    row,
    col,
    onClick,
    backgroundColor,
}: FarmTileComponentProps) {
    return (
        <div
            style={{
                border: 'blue solid 1px',
                width: '9rem',
                height: '9rem',
                margin: '10px',
                backgroundColor: backgroundColor || '',
            }}
            onClick={() => onClick && onClick(row, col)}
        >
            {tile}
        </div>
    );
}
