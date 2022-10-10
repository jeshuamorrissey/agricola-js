import { useEffect, useState } from 'react';
import { ActionsByStage } from './components/ActionTiles';
import { PlayerDisplay } from './components/PlayerDisplay';
import { useStore } from './systems/state/useStore';

export function App() {
    const state = useStore();
    const [actionsByStage, setActionsByStage] = useState<ActionsByStage>({});

    useEffect(() => {
        const newactionsByStage: ActionsByStage = {
            0: state.defaultActions,
        };

        for (
            let i = 0;
            i < Math.min(state.currentRound + 1, state.rounds.length);
            i++
        ) {
            const roundObj = state.rounds[i];
            if (!newactionsByStage[roundObj.stage]) {
                newactionsByStage[roundObj.stage] = [];
            }

            newactionsByStage[roundObj.stage].push(roundObj.newAction);
        }

        setActionsByStage(newactionsByStage);
    }, [state.defaultActions, state.rounds, state.currentRound]);

    useEffect(() => {
        if (state.player.remainingActions === 0) {
            state.advanceRound();
        }
    }, [state]);

    return (
        <div>
            <PlayerDisplay
                farm={state.player.farm}
                resources={state.player.resources}
                availableActions={actionsByStage}
                inHarvest={state.isInHarvest}
                gameOver={state.isGameOver}
                remainingActions={state.player.remainingActions}
                round={state.currentRound + 1}
                stage={state.rounds[state.currentRound].stage}
                onHarvestTriggered={() => state.harvest()}
            />
        </div>
    );
}
