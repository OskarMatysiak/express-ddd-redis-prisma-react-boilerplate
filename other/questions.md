**Event Loop - mechanizm który pozwala JS obsługiwać asynchroniczne operacje mimo ze jest jednowątkowy.**

**Call stack - stos wywołań - tam wywołuje się kod. Gdy jest pusty zostaje uzupełniany przez event loop.**


const fs = require("fs");

// `SYNC` – wykonuje się natychmiast, blokuje stos dopóki się nie skończy
console.log("1 - sync");

// `TIMERS (faza 1)` – callback wykona się gdy minął zadeklarowany czas (min. 1ms)
// nie jest gwarantowany co do milisekundy, tylko "nie wcześniej niż"
setTimeout(() => console.log("4 - setTimeout"), 0);


// `POLL (faza 4)` – tu Event Loop czeka na zdarzenia I/O i wykonuje ich callbacki
// najważniejsza faza – obsługuje pliki, sieć, sockety
fs.readFile("dane.txt", () => console.log("? - readFile"));

// `CHECK (faza 5)` – wykonuje się zawsze po fazie poll, w tej samej iteracji Event Loop
// pewniejszy niż setTimeout(fn, 0) gdy zależy nam na kolejności
setImmediate(() => console.log("3 - setImmediate"));


// `MICROTASK` (między fazami) – najwyższy priorytet spośród async
// wykonuje się po każdej fazie, zanim Event Loop przejdzie dalej
Promise.resolve().then(() => console.log("2 - Promise"));

// `SYNC` – wykonuje się natychmiast, przed jakimkolwiek async
console.log("1 - sync (koniec)");

// Wynik:
// 1 - sync              ← sync, od razu
// 1 - sync (koniec)     ← sync, od razu
// 2 - Promise           ← microtask, przed fazami
// 4 - setTimeout        ← faza timers (lub po setImmediate, zależy od 1ms progu)
// 3 - setImmediate      ← faza check, po poll
// ? - readFile          ← faza poll, zależy od szybkości dysku


`process.nextTick()` ustawia callback do wykonania po zakończeniu bieżącego kodu synchronicznego, ale przed jakąkolwiek fazą Event Loop.
`setImmediate()` - wywołuje się w fazie `CHECK`



**Event Loop blokuje się gdy Call Stack nie jest opróżniany**

1. Ciężkie obliczenia
2. Synchroniczne operacje I/O

```
const data = fs.readFileSync("duzy-plik.txt", "utf8");
console.log(data);
```

// ✅ zawsze używaj wersji async
fs.readFile("duzy-plik.txt", "utf8", (err, data) => {
  console.log(data)


3. Rekurencyjny process.nextTick

  // ❌ Event Loop nigdy nie dostanie kontroli
function zapetlenie() {
  process.nextTick(zapetlenie);
}
zapetlenie();
// setTimeout, I/O, setImmediate – zablokowane na zawsze

// ✅ użyj setImmediate – odpuszcza po każdej iteracji
function bezpieczne() {
  setImmediate(bezpieczne);
}

`Skrót: nextTick musi być całkowicie opróżniony zanim Event Loop ruszy – więc nieskończona rekurencja go zatrzymuje. setImmediate planuje callback na następną iterację – więc zawsze zostawia miejsce dla innych zadań.`



**Salt rozwiązuje:**


const crypto = require("crypto");

// generowanie salta – unikalny dla każdego użytkownika
const salt = crypto.randomBytes(32).toString("hex");
// → "a1f3c8e2..." (losowy, 64 znaki)

// hashowanie hasła + salt
crypto.pbkdf2("haslo123", salt, 100_000, 64, "sha512", (err, hash) => {
  const hashString = hash.toString("hex");

  // zapisujesz w bazie: hash + salt (oba potrzebne do weryfikacji!)
  db.save({ hash: hashString, salt: salt });



- Dwóch użytkowników z hasłem `haslo123` → **różne hashe** (bo różne salty)
- Rainbow tables bezużyteczne – atakujący musiałby liczyć tablicę osobno dla każdego salta


**Pepper rozwiązuje:**
`const PEPPER = process.env.APP_PEPPER; // "mójTajnyPepper123!"`
// dodawany do hasła przed hashowaniem
`const hasloZPepperem = haslo + PEPPER;`

Atakujący ukradł bazę danych → nadal nie może złamać haseł bez peppera
Pepper jest sekretem aplikacji, nie użytkownika




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



**libuv** to napisana w C biblioteka, która dostarcza Node.js wieloplatformową warstwę abstrakcji nad operacjami I/O. To ona umożliwia asynchroniczne działanie Node.js mimo jednowątkowości JS.

Język C
Thread pool 4 wątki domyślnie
Event loop 6 faz na iterację
Sieć Zawsze async (bez thread pool)
Pliki Thread pool (OS file I/O nie jest w pełni async)




```
jsfs.readFile('plik.txt', (err, data) => {
  console.log(data); // 3. callback wraca do JS
});

console.log('To wykona się pierwsze'); // 1. synchronicznie
```

1. Node wywołuje fs.readFile
2. libuv przekazuje zadanie do thread pool
3. JS thread idzie dalej (nie blokuje!)
4. Wątek OS kończy czytanie pliku
5. libuv wrzuca callback do event loop
6. Event loop wywołuje callback w JS





`Backpressure` to mechanizm, który mówi producentowi "zwolnij, nie nadążam".
**highWaterMark — próg bufora**
To maksymalna ilość danych w buforze zanim stream "się zatrzyma":

`pipeline()` — backpressure automatycznie



**Memory Leak**
To sytuacja, gdy program alokuje pamięć, ale nigdy jej nie zwalnia — mimo że nie jest już potrzebna.

// 1. Globalne zmienne
`leak = "przypadkowy global"; // brak let/const/var!`

// 2. Zapomniany event listener
`button.addEventListener('click', handler); // nigdy removeEventListener`

// 3. Zapomniany setInterval
`setInterval(() => {`
  // trzyma referencje do wszystkiego w closure
`}, 1000); // nigdy clearInterval`

// 4. Cache bez limitu
`const cache = {};`
`cache[id] = dane;` // rośnie bez końca, nic nie usuwa

//akumulowanie danych w pamięci zamiast streamowania,

//trzymanie dużych Bufferów (np. logi, payloady),

//błędne użycie Promise (np. kolekcje nierozliczonych promise).


`process.memoryUsage()` — monitoring

## Orinoco — incremental & concurrent GC


## GC nie usuwa obiektów "bo są stare" — usuwa je gdy nikt już nie trzyma referencji. Dlatego memory leak w JS = niechciana referencja która blokuje sprzątanie.


New Space to mały (~8MB) i szybko sprzątany obszar — trafiają tu wszystkie nowe obiekty. Gdy się zapełni, odpala się Minor GC (~1ms), który usuwa martwe obiekty, a żywe przenosi do Old Space.
Old Space to duży magazyn dla długożyjących obiektów. Gdy zapełni się w ~70%, odpala się Major GC — działa dłużej bo musi przeskanować znacznie więcej pamięci.

## Im mniej obiektów "awansuje" do Old Space, tym rzadziej odpala się wolny Major GC — dlatego krótko żyjące obiekty są wydajne.


----------------------------------------------------------------------------------

## Asynchroniczność i Concurrency

`Promise.all` — `"wszystko albo nic"`
jsconst [user, posts, comments] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchComments(id)
]);

Kiedy używać: gdy potrzebujesz wszystkich wyników i brak jednego czyni resztę bezużyteczną.


`Promise.allSettled` — "poczekaj na wszystkich, bez względu na wynik"
Kiedy używać: niezależne operacje, gdzie częściowy sukces jest akceptowalny — np. wysyłanie powiadomień do wielu użytkowników, batch operations.

`Promise.race` — "wygrywa pierwszy, niezależnie od wyniku"
Implementacja timeoutów dla żądań
Wyścig między cache a siecią (pierwsze wygrywa)

`Promise.any` — "pierwszy sukces"


# Jak ograniczyć liczbę równoległych operacji asynchronicznych (np. 1000 requestów do API)? *

Rozwiązanie 2: Biblioteka `p-limit` (produkcja)

kolejka

## worker_threads vs cluster w Node.js

cluster                          worker_threads
─────────────────────────────    ────────────────────────────────
Osobne procesy OS                Wątki w jednym procesie
Osobna pamięć (heap)             Współdzielona pamięć możliwa
Izolacja błędów (crash = 1 proc) Crash wątku może zabić proces
IPC przez socket/pipe            Bezpośredni MessageChannel
~30ms start + duże RAM           ~1ms start + małe RAM
Skalowanie I/O (HTTP)            Skalowanie CPU (obliczenia)


# Graceful Shutdown — SIGTERM w Kubernetes

Kubernetes wysyła SIGTERM
        ↓
Node.js process.exit() natychmiast
        ↓
❌ In-flight requesty ucięte w połowie
❌ Połączenia z DB nie zamknięte
❌ Wiadomości z kolejki oznaczone jako nieprzetworzone
❌ Użytkownik dostaje 502 Bad Gateway

`process.on('SIGTERM', async () => {`
  // Czekaj aż kube-proxy propaguje usunięcie z load balancera
  `await sleep(5000); // ← kluczowe!`
  `await shutdown();`
`});`


# Kubernetes robi z automatu

Self-healing      → pod padł? K8s go restartuje / przenosi na inny node
Skalowanie        → duży ruch? uruchom więcej podów (HPA)
Rolling deploy    → nowa wersja bez downtimeu (stare pody gaszone po kolei)
Load balancing    → rozdziela ruch między pody
SIGTERM / SIGKILL → właśnie to omawialiśmy przy graceful shutdown



# Retry z Exponential Backoff
Czym jest exponential backoff?
Próba 1 nieudana → czekaj 1s
Próba 2 nieudana → czekaj 2s
Próba 3 nieudana → czekaj 4s
Próba 4 nieudana → czekaj 8s
...
`Zamiast bombardować serwer co 100ms, dajesz mu coraz więcej czasu na dojście do siebie.`

Zasady:
  1. Nie retry'uj błędów 4xx (poza 429) — nie pomogą
  2. Zawsze dodaj jitter — unikasz thundering herd (odpytywania ponownego w tej samej chwili)
  3. Ustaw maxDelay — bez górnego limitu czasy rosną bez końca
  4. Respektuj nagłówek Retry-After gdy serwer go zwraca
  5. W produkcji użyj p-retry zamiast pisać własne




--------------------------------------------------------------------------------------------

3. Architektura i Projektowanie Systemów

✅ Kiedy monolit ma sens
Nowy produkt / startup — nie znasz jeszcze granic domenowych
Mały zespół (< 10 developerów) — overhead mikroserwisów zabija produktywność
Prosta domena — CRUD bez skomplikowanej logiki biznesowej
Szybkość iteracji — chcesz deployować features, nie infrastrukturę
Brak potrzeby niezależnego skalowania — cały system ma podobne obciążenie

❌ Kiedy monolit boli
Deployment jednej zmiany wymaga testowania całości
Różne moduły potrzebują różnych technologii/języków
Jeden moduł "zabija" zasoby całej aplikacji
Zespoły blokują się wzajemnie przy merge'ach



✅ Kiedy mikroserwisy mają sens

Duży zespół — każdy team owneruje swój serwis end-to-end
Niezależne skalowanie — np. PaymentService potrzebuje 10x więcej mocy niż reszta
Różne wymagania techniczne — ML w Pythonie, real-time w Go, CRUD w Node
High availability — awaria jednego serwisu nie zatrzymuje całości
Regulacje — izolacja danych PCI-DSS, GDPR per serwis

❌ Kiedy mikroserwisy to over-engineering

Mały zespół traci czas na DevOps zamiast na features
Distributed transactions stają się koszmarem
Debugging przez 5 serwisów zamiast jednego stack trace'a
Latency: wywołanie lokalne (μs) → sieciowe (ms)


# Jak rozwiązać problem idempotency w API?

Rozwiązanie — Idempotency Key
Klient generuje unikalny klucz i dołącza do każdego requestu. Serwer zapamiętuje wynik i przy powtórzeniu zwraca ten sam rezultat bez ponownego wykonania.

trzymany w cashu lub w bazie danych


To `Optimistic Locking` (pesymistyczne vs optymistyczne blokowanie).
Jak działa?
Zamiast blokować rekord przy odczycie, dodajesz kolumnę version (lub updated_at) i sprawdzasz ją przy zapisie.

alternatywnie semafory, kolejki, mutex


# Jak zaprojektować system obsługujący 10k RPS?

Jeden Node.js process obsłuży ~1 000–3 000 RPS (zależnie od logiki).

Rate Limiting — ochrona systemu

Kluczowa zasada: Nie optymalizuj z góry. Mierz → znajdź bottleneck → optymalizuj tylko to miejsce. 90% problemów z wydajnością rozwiązuje cache + indeksy w DB.






# Connection Pooling — jak działa i dlaczego jest kluczowy


Problem bez poolingu
Każde nawiązanie połączenia z bazą danych to kosztowna operacja:
Aplikacja → [TCP handshake] → [autentykacja] → [alokacja zasobów na DB] → Zapytanie

Cykl życia połączenia:

Inicjalizacja — pool tworzy z góry min_connections połączeń przy starcie
Checkout — żądanie "wypożycza" wolne połączenie (niemal natychmiastowo)
Użycie — aplikacja wykonuje zapytanie
Return — połączenie wraca do puli (nie jest zamykane!)
Oczekiwanie — gdy wszystkie zajęte, żądanie czeka lub dostaje timeout


Normalizacja vs Denormalizacja

`Denormalizacja` (dodawane na mongoDB)
To świadome powielanie lub łączenie danych w strukturze bazy, żeby zredukować liczbę operacji potrzebnych do ich odczytu. Jest odwrotnością normalizacji.

To jest właśnie trade-off denormalizacji — szybszy odczyt kosztem trudniejszej aktualizacji.



Koszt indeksu
Indeks to nie magia — ma swoją cenę:
                  BEZ INDEKSU       Z INDEKSEM
Odczyt (SELECT)   wolny             błyskawiczny
Zapis (INSERT)    szybki            wolniejszy (trzeba aktualizować indeks)
Pamięć            mniej             więcej (indeks zajmuje miejsce)
Dlatego nie indeksuje się wszystkiego — tylko kolumny, po których często szukasz.

Prosta zasada
Często filtrujesz po kolumnie?   → dodaj indeks
Kolumna rzadko używana w WHERE?  → indeks tylko przeszkadza

PRIMARY KEY     ✅ automatyczny unikalny indeks
UNIQUE          ✅ automatyczny unikalny indeks
FOREIGN KEY     ❌ NIE — musisz dodać ręcznie!
Zwykła kolumna  ❌ NIE — musisz dodać ręcznie

`Brak indeksu na kluczu obcym to jeden z najczęstszych błędów wydajnościowych w PostgreSQL.`



# jak analizować slow queries?
`EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;`


Kluczowa zasada: zacznij od ORM, przejdź na Query Builder gdy potrzebujesz kontroli, sięgnij po Raw SQL gdy ORM i Query Builder nie dają rady.

`Raw SQL` daje pełną kontrolę i maksymalną wydajność, ale wymaga dużo kodu i sam pilnujesz bezpieczeństwa. Najlepszy do złożonych zapytań i raportów.

`Query Builder` to złoty środek — automatyczna ochrona przed SQL injection, łatwa kompozycja dynamicznych zapytań, przy zachowaniu dużej kontroli nad tym co trafia do bazy.

`ORM` pozwala pisać najszybciej i operować na obiektach zamiast tabelach, ale łatwo nieświadomie wygenerować nieefektywny SQL lub wpaść w pułapkę N+1.


# Optimistic Locking — jak zaimplementować
Idea
Zamiast blokować rekord przy odczycie, zakładasz że nikt inny go nie zmieni. Przy zapisie sprawdzasz czy ktoś go nie zmodyfikował w międzyczasie.

# CDN
Jak działa krok po kroku

1. Użytkownik żąda pliku (np. logo.png)
2. DNS kieruje go do najbliższego serwera CDN
3. CDN ma plik w cache? → oddaje od razu (cache HIT)
4. CDN nie ma pliku?   → pobiera z backendu, cache'uje, oddaje (cache MISS)
5. Kolejny użytkownik z tego samego regionu → cache HIT

CACHOWANE (CDN przejmuje ruch):       NIE CACHOWANE (trafia do backendu):
- obrazy, video, pliki statyczne      - API z dynamicznymi danymi
- JS, CSS, HTML (landing page)        - dane użytkownika, koszyk, sesje
- fonty, ikony                        - operacje POST/PUT/DELETE


Wdrożyłeś nowy JS → CDN nadal serwuje stary plik

Rozwiązania:
1. Versioning w nazwie pliku: app.v2.3.1.js
2. Hash w nazwie:             app.a3f8c2.js    ← najpopularniejsze
3. Ręczne czyszczenie cache w CDN


DDoS attack → miliony requestów → CDN przyjmuje uderzenie
                                   backend nawet nie widzi ruchu


# cache

In-memory  → dane sesji, małe lookup tables, dane niezmienne
             jeden serwer, prototyp, prosta aplikacja

Redis      → dane współdzielone między instancjami
             wyniki drogich zapytań, rate limiting, kolejki

HTTP Cache → statyczne zasoby (JS, CSS, obrazy)
             publiczne API które rzadko się zmienia
             dane serwowane przez CDN

etag - hashowany obiekt do porownania wersji 