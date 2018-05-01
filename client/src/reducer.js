import createActions from "./create-actions";
import { createReducer } from "redux-act";

export const initialState = {
    cpuHistory2: [],
    cpuHistory10: [],
    cpuHistory15: [],
    notifications: []
};

export const actions = createActions("cpuLoadMonitor", [
    "setField",
    "setCpuHistory2",
    "setCpuHistory10",
    "setCpuHistory15",
    "addNotification"
]);

export const reducer = createReducer(
    {
        [actions.setField](state, { key, value }) {
            return { ...state, [key]: value };
        },
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
        },
        [actions.addNotification](state, notification) {
            return {
                ...state,
                notifications: [notification, ...state.notifications]
            };
        }
    },
    initialState
);
