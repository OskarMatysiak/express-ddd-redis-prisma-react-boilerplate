const {parentPort}= require("worker_threads");

parentPort.on("message", (dane) => {
    console.log("otrzymalem: ", dane);
    parentPort.postMessage({answer: dane.liczba})
})




