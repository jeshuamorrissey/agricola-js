import { Action } from './action';

export interface Round {
    stage: number;
    newAction: Action;
}
