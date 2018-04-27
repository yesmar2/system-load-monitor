const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

// average the CPU cores in case have more than one. Will handle array of 1 fine too.

const os = require("os");
const cpu = require("windows-cpu");
const delaySeconds = 1;
const decimals = 3;
function loop() {
    cpuLoad((error, result) => {
        if (error) {
            console.log("CPU load - error retrieving");
        } else {
            console.log("CPU load is " + result);
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
}

app.get("/api/hello", (req, res) => {
    loop();
    res.send({ express: "Hello From Express" });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
