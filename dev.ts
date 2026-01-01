import { RelayPool } from "./index.ts";

console.log("Starting NostrRelayPool in DEV mode...");

const pool = new RelayPool(undefined, {
    logSubscriptions: true,
    logErrorsAndNotices: true,
});

const relays = [
    "wss://relay.damus.io",
    "wss://nos.lol",
];

relays.forEach(url => {
    console.log(`Adding relay: ${url}`);
    pool.addOrGetRelay(url);
});

// Example subscription
console.log("Subscribing to recent kind 1 events...");
pool.subscribe(
    [{ kinds: [1], limit: 5 }],
    relays,
    (event) => {
        console.log(`[EVENT] Kind: ${event.kind} Author: ${event.pubkey.slice(0, 8)}... Content: ${event.content.slice(0, 50)}...`);
    }
);

// Keep process alive
setInterval(() => {}, 10000);
