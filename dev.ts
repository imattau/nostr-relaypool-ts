import { RelayPool } from "./index.ts";

console.log("\n🚀 Starting NostrRelayPool in DEV mode...\n");

const pool = new RelayPool(undefined, {
    logSubscriptions: true,
    logErrorsAndNotices: true,
});

const relays = [
    "wss://relay.damus.io",
    "wss://nos.lol",
];

console.log("--- 📡 Relay Configuration ---");
console.log("Target Relays (links to connect to):");
relays.forEach(r => console.log(` - ${r}`));
console.log("------------------------------\n");

relays.forEach(url => {
    const relay = pool.addOrGetRelay(url);
    relay.on("connect", () => {
        console.log(`✅ Connected to ${url} (ReadyState: ${relay.status})`);
    });
    relay.on("error", (err: any) => {
        console.log(`❌ Error connecting to ${url}: ${err}`);
    });
    relay.on("disconnect", () => {
        console.log(`⚠️ Disconnected from ${url}`);
    });
});

// Example subscription
console.log("🔍 Subscribing to recent kind 1 events...");
pool.subscribe(
    [{ kinds: [1], limit: 5 }],
    relays,
    (event) => {
        console.log(`[EVENT] Kind: ${event.kind} | Author: ${event.pubkey.slice(0, 8)}... | Content: ${event.content.slice(0, 50).replace(/\n/g, ' ')}...`);
    }
);

// Keep process alive
setInterval(() => {}, 10000);
