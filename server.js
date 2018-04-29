const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const os = require("os");
const cpu = require("windows-cpu");

const port = process.env.PORT || 5000;
const delaySeconds = 10;
let dataPoint = null;

let cpuHistory2 = [];
let cpuHistory10 = [];
let cpuHistory15 = [];

function loop() {
    cpuLoad((error, result) => {
        if (error) {
            console.log("CPU load - error retrieving");
        } else {
            dataPoint = {
                cpu: result, // load average for 1 minute
                timestamp: Date.now()
            };

            cpuHistory2.push(dataPoint);
            if (cpuHistory2.length > 12) {
                cpuHistory2.shift();
            }

            cpuHistory10.push(dataPoint);
            if (cpuHistory10.length > 60) {
                cpuHistory10.shift();
            }

            cpuHistory15.push(dataPoint);
            if (cpuHistory15.length > 90) {
                cpuHistory15.shift();
            }

            io.emit("monitor2", cpuHistory2);
            io.emit("monitor10", cpuHistory10);
            io.emit("monitor15", cpuHistory15);

            //console.log(cpuHistory10);
        }
    });

    setTimeout(loop, delaySeconds * 1000);
}

function cpuLoad(cb) {
    cpu.totalLoad((error, cpus) => {
        if (error) {
            return cb(error);
        }
        console.log("cpus", cpus);

        let sum = 0;
        let avg = 0;

        if (cpus.length > 0) {
            // Average the CPU loads since may be multiple cores on the machine.
            sum = cpus.reduce((a, b) => {
                return a + b;
            });
            avg = sum / cpus.length;
        }

        cb(null, avg);
    });
}

const listen = () => {
    server.listen(port, () => {
        console.log(`Server listening on port ${port}...`);
    });
};

loop();

// Setup socket connection with client
io.on("connection", client => {
    client.emit("initialState", {
        cpuHistory2: cpuHistory2,
        cpuHistory10: cpuHistory10,
        cpuHistory15: cpuHistory15
    });
});

// Start server
listen();
