import io from "socket.io-client";
import { actions } from "./reducer";

const port = process.env.PORT || 5000;

const initSocket = dispatch => {
    const socket = io.connect(`http://localhost:${port}/`);

    socket.on("initialState", data => {
        dispatch(actions.setHistory(data.history));
    });

    socket.on("monitor", history => {
        dispatch(actions.setHistory(history));
    });

    return socket;
};

export default initSocket;
