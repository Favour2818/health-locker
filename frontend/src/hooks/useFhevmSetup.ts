import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { initializeFheInstance, getFheInstance } from "../lib/fhevm";

export default function useFhevmSetup() {
const { isConnected } = useAccount();
const chainId = useChainId();
const [isInitialized, setInitialized] = useState(false);
const [isInitializing, setInitializing] = useState(false);

useEffect(() => {
if (!isConnected) return;
if (chainId !== 11155111) return;
if (isInitialized || isInitializing) return;

async function init() {
try {
setInitializing(true);

if (!window.RelayerSDK && !window.relayerSDK) {
await new Promise((resolve, reject) => {
const script = document.createElement("script");
script.src =
"https://cdn.zama.org/relayer-sdk-js/0.3.0-5/relayer-sdk-js.umd.cjs";
script.async = true;
script.onload = resolve;
script.onerror = reject;
document.body.appendChild(script);
});
}

await initializeFheInstance();
setInitialized(!!getFheInstance());
} catch (err) {
console.error("FHEVM init failed:", err);
} finally {
setInitializing(false);
}
}

init();
}, [isConnected, chainId, isInitialized, isInitializing]);

return { isInitialized, isInitializing };
}