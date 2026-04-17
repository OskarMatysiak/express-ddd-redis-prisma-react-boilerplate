const {Worker} = require("worker_threads");
const worker = new Worker("./worker.js")


worker.postMessage({tekst: "hello", liczba : 42});

worker.on("message", (wiadomosc) => console.log("worker odpowiedzial: ", wiadomosc));


function* fibonacci(){
    let [a,b] = [0,1];
    while(true){
        yield a;
        [a,b] = [b, a + b]
}
}

const gen = fibonacci();
console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);


// ❌ RACE CONDITION – dwa wątki piszą jednocześnie
// Atomics.add(arr, 0, 1); // atomowa operacja – bezpieczna!



// WĄTKI (worker_threads) – gdy:
// ✅ obliczenia CPU (fibonacci, kompresja, kryptografia)
// ✅ potrzebujesz dzielić duże dane (SharedArrayBuffer)
// ✅ zależy ci na szybkim starcie
// ✅ zadania są krótkie i liczne


// PROCESY (child_process) – gdy:
// ✅ uruchamiasz zewnętrzny skrypt/program
// ✅ potrzebujesz pełnej izolacji (crash nie zabija rodzica)
// ✅ różne środowiska (inny Node.js, Python, bash...)
// ✅ bezpieczeństwo (niezaufany kod)
