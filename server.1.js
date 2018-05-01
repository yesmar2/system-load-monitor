const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const os = require("os");
const cpu = require("windows-cpu");

const port = process.env.PORT || 5000;
const delaySeconds = 10;
const decimals = 3;
let dataPoint = null;
let history = [];

function loop() {
    console.log("loop");
    cpuLoad((error, result) => {
        if (error) {
            console.log("CPU load - error retrieving");
        } else {
            
            dataPoint = {
                loadavg: e.loadavg[0], // load average for 1 minute
                timestamp: Date.now()
            };

            history.push(dataPoint);
            if (history.length > 10) {
                history.shift();
            }

            io.emit("monitor", history.toArray());
            
            console.log(history);
        }
    });

    setTimeout(loop, delaySeconds * 1000);
}

function cpuLoad(cb) {
    if (process.platform === "win32") {
        cpu.totalLoad((error, cpus) => {
            if (error) {
                return cb(error);
            }
            // Average the CPU loads since may be multiple cores on the machine.
            let sum = cpus.reduce((a, b) => {
                return a + b;
            });
            let avg = sum / cpus.length;

            cb(null, avg);
        });
    } else {
        let linuxCpuLoad = os.loadavg()[0] * 100;
        linuxCpuLoad = linuxCpuLoad.toFixed(decimals);
        cb(null, linuxCpuLoad);
    }

const listen = () => {
    server.listen(port, () => {
        console.log(`Server listening on port ${port}...`);
    });
};

loop();

// Setup socket connection with client
// io.on("connection", client => {
//     client.emit("initialState", {
//         history: history
//     });
// });

// Start server
listen();
