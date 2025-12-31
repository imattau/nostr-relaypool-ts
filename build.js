#!/usr/bin/env node

import {build} from "esbuild";

let common = {
  entryPoints: ["index.ts"],
  bundle: true,
  sourcemap: "external",
};

build({
  ...common,
  outfile: "lib/nostr-relaypool.esm.js",
  format: "esm",
  packages: "external",
  external: ["node:*"], // Exclude node built-ins for ESM build
  platform: "browser",
}).then(() => console.log("esm build success."));

build({
  ...common,
  outfile: "lib/nostr-relaypool.cjs",
  format: "cjs",
  packages: "external",
  external: ["node:*"], // Exclude node built-ins for CJS build
  platform: "node", // Target Node.js for CJS build
}).then(() => console.log("cjs build success."));

build({
  ...common,
  outfile: "lib/nostr-relaypool.bundle.js",
  format: "iife",
  globalName: "NostrRelayPool",
  define: {
    window: "self",
    global: "self",
    process: '{"env": {}}',
  },
  external: ["node:*"], // Exclude node built-ins for standalone build
  platform: "browser",
}).then(() => console.log("standalone build success."));

// build worker
build({
  ...common,
  outfile: "lib/nostr-relaypool.worker.js",
  format: "esm",
  target: "es2018",
  loader: {
    ".ts": "ts",
  },
  entryPoints: ["relay-pool.worker.ts"],
  external: ["@nostr/core", "node:*"], // Exclude node built-ins for worker build
  platform: "browser",
}).then(() => console.log("worker build success."));
