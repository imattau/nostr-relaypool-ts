import { RelayPool } from "./index.ts";

// --- Configuration ---
const RELAYS = [
    "wss://relay.damus.io",
    "wss://nos.lol",
];
const REFRESH_RATE_MS = 200;

// --- State ---
let eventCount = 0;
const logs: string[] = [];
const relayStatuses = new Map<string, string>();

// --- Logging Helper ---
function logError(msg: string) {
    const timestamp = new Date().toLocaleTimeString();
    logs.push(`[${timestamp}] ❌ ${msg}`);
    if (logs.length > 5) logs.shift();
    drawDashboard();
}

function logWarning(msg: string) {
    const timestamp = new Date().toLocaleTimeString();
    logs.push(`[${timestamp}] ⚠️ ${msg}`);
    if (logs.length > 5) logs.shift();
    drawDashboard();
}

// --- Dashboard ---
function drawDashboard() {
    // Clear screen and move to top-left
    process.stdout.write('\x1b[2J\x1b[0;0H');

    console.log("🚀 NostrRelayPool DEV Mode");
    console.log("========================================");
    
    // Stats
    const cacheSize = pool.eventCache?.eventsById.size || 0;
    // @ts-ignore - Accessing internal capacity if available, or just showing size
    const capacity = pool.eventCache?.capacity || "unknown";
    console.log(`📊 Events Received: ${eventCount}  |  💾 Cache Size: ${cacheSize} / ${capacity}`);
    console.log("----------------------------------------");

    // Relays
    console.log("📡 Relays:");
    RELAYS.forEach(url => {
        const status = relayStatuses.get(url) || "Unknown";
        let icon = "⚪";
        if (status === "Connected") icon = "✅";
        else if (status.startsWith("Error")) icon = "❌";
        else if (status === "Disconnected") icon = "⚠️";
        else if (status === "Connecting") icon = "⏳";
        
        console.log(` ${icon} ${url} : ${status}`);
    });
    console.log("----------------------------------------");

    // Recent Logs
    console.log("Recent Warnings/Errors:");
    if (logs.length === 0) {
        console.log(" (None)");
    } else {
        logs.forEach(l => console.log(l));
    }
    console.log("========================================");
    console.log("Press Ctrl+C to exit.");
}

// --- Initialization ---

// Disable internal logging to keep console clean
const pool = new RelayPool(undefined, {
    logSubscriptions: false,
    logErrorsAndNotices: false,
    useEventCache: true,
});

// Setup Relays
RELAYS.forEach(url => {
    relayStatuses.set(url, "Connecting");
    const relay = pool.addOrGetRelay(url);
    
    relay.on("connect", () => {
        relayStatuses.set(url, "Connected");
        drawDashboard();
    });
    relay.on("error", (err: any) => {
        relayStatuses.set(url, `Error`);
        logError(`${url}: ${err}`);
    });
    relay.on("disconnect", () => {
        relayStatuses.set(url, "Disconnected");
        drawDashboard();
    });
    relay.on("notice", (msg: string) => {
        logWarning(`${url} Notice: ${msg}`);
    });
});

// Subscribe
pool.subscribe(
    [{ kinds: [1], limit: 20 }],
    RELAYS,
    (event) => {
        eventCount++;
        // Don't redraw on every event to avoid flicker, rely on interval
    }
);

// Refresh Loop
setInterval(drawDashboard, REFRESH_RATE_MS);

// Initial Draw
drawDashboard();

