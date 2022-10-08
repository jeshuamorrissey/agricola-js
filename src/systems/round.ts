import { Action } from './actions/action';

export interface Round {
    stage: number;
    newAction: Action;
}
