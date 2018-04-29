import createActions from "./create-actions";
import { createReducer } from "redux-act";

export const initialState = {
    cpuHistory2: [],
    cpuHistory10: [],
    cpuHistory15: []
};

export const actions = createActions("simpleLoadMonitor", [
    "setCpuHistory2",
    "setCpuHistory10",
    "setCpuHistory15"
]);

export const reducer = createReducer(
    {
        [actions.setCpuHistory2](state, cpuHistory2) {
            return {
                ...state,
                cpuHistory2: cpuHistory2.map(e => {
                    e.date = new Date(e.timestamp);
                    return e;
                })
            };
        },
        [actions.setCpuHistory10](state, cpuHistory10) {
            return {
                ...state,
                cpuHistory10: cpuHistory10.map(e => {
                    e.date = new Date(e.timestamp);
                    return e;
                })
            };
        },
        [actions.setCpuHistory15](state, cpuHistory15) {
            return {
                ...state,
                cpuHistory15: cpuHistory15.map(e => {
                    e.date = new Date(e.timestamp);
                    return e;
                })
            };
        }
    },
    initialState
);
