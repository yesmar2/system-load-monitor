import io from "socket.io-client";
import { actions } from "./reducer";

const port = process.env.PORT || 5000;

const initSocket = dispatch => {
    const socket = io.connect(`http://localhost:${port}/`);

    socket.on("initialState", data => {
        dispatch(actions.setCpuHistory2(data.cpuHistory2));
        dispatch(actions.setCpuHistory10(data.cpuHistory10));
        dispatch(actions.setCpuHistory15(data.cpuHistory15));
        dispatch(
            actions.setField({
                key: "notifications",
                value: data.notifications
            })
        );
    });

    socket.on("monitor2", cpuHistory2 => {
        dispatch(actions.setCpuHistory2(cpuHistory2));
    });

    socket.on("monitor10", cpuHistory10 => {
        dispatch(actions.setCpuHistory10(cpuHistory10));
    });

    socket.on("monitor15", cpuHistory15 => {
        dispatch(actions.setCpuHistory15(cpuHistory15));
    });

    socket.on("notification", notification => {
        dispatch(actions.addNotification(notification));
    });

    return socket;
};

export default initSocket;
