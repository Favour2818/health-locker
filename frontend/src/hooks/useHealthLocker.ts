// @ts-ignore
import { createEncryptedInput, decryptValue, initializeFheInstance } from "../lib/fhevm";

import { useEffect, useState } from "react";
import { HEALTH_LOCKER_ADDRESS, HEALTH_LOCKER_ABI } from "../utils/contract";
import { useAccount, useChainId } from "wagmi";
import { ethers } from "ethers";
import useFhevmSetup from "./useFhevmSetup";
import { MEDICAL_CATEGORIES } from "../utils/categories";

export interface RecordRow {
index: number;
dataType: string;
value: number | null;
timestamp: string;
isPublic: boolean;
}

export default function useHealthLocker() {
const [records, setRecords] = useState<RecordRow[]>([]);
const { address, isConnected } = useAccount();
const chainId = useChainId();
const { isInitialized } = useFhevmSetup();

const getProvider = () => new ethers.BrowserProvider(window.ethereum as any);
const getSigner = async () => (await getProvider()).getSigner();
const getContract = async () =>
new ethers.Contract(HEALTH_LOCKER_ADDRESS, HEALTH_LOCKER_ABI, await getSigner());

// Reset local data when disconnected
useEffect(() => {
if (!isConnected) {
setRecords([]);
}
}, [isConnected]);

// Load once initialized
useEffect(() => {
if (isConnected && chainId === 11155111 && isInitialized) {
loadRecords();
}
}, [isConnected, chainId, isInitialized]);

async function ensureReady(notify?: (msg: string) => void): Promise<boolean> {
if (!isConnected) return notify?.(" Connect your wallet first"), false;
if (chainId !== 11155111) return notify?.(" Switch to Sepolia"), false;

if (!isInitialized) {
notify?.(" Initializing privacy engine…");
try {
await initializeFheInstance();
} catch (err) {
notify?.(" Privacy engine unavailable");
return false;
}
}
return true;
}

async function loadRecords(notify?: (msg: string) => void) {
if (!(await ensureReady(notify))) return;
try {
const contract = await getContract();
const count = Number(await contract.getRecordCount(address!));
const recs: RecordRow[] = [];

for (let i = 0; i < count; i++) {
const [dataType, timestamp, encrypted, isPublic] =
await contract.getEncryptedRecord(address!, i);

recs.push({
index: i,
dataType: MEDICAL_CATEGORIES[Number(dataType)] || "Unknown",
value: null,
timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
isPublic
});
}
setRecords(recs.reverse());
} catch (err) {
console.error(err);
notify?.(" Failed to load health records");
}
}

async function decryptRecord(index: number, notify?: (msg: string) => void) {
  if (!(await ensureReady(notify))) {
    throw new Error("Not ready");
  }

  try {
    const contract = await getContract();
    const signer = await getSigner();

    let encryptedValue = (await contract.getEncryptedRecord(address!, index))[2];
    if (typeof encryptedValue === "bigint")
      encryptedValue = "0x" + encryptedValue.toString(16).padStart(64, "0");

    const value = await decryptValue(
      encryptedValue,
      HEALTH_LOCKER_ADDRESS,
      signer
    );

    setRecords((prev) =>
      prev.map((rec) =>
        rec.index === index ? { ...rec, value: Number(value) } : rec
      )
    );

    // success message
    notify?.(` Record decrypted: ${value}`);
  } catch (err) {
    console.error(err);
    // ❗ Don't notify failure here, just let it bubble up
    throw err;
  }
}

async function addHealthRecord(dataType: string, value: number, notify?: (msg: string) => void) {
if (value <= 0) return notify?.(" Invalid value");
if (!(await ensureReady(notify))) return;

try {
const contract = await getContract();
const encrypted = await createEncryptedInput(HEALTH_LOCKER_ADDRESS, address!, value);
const timestamp = BigInt(Math.floor(Date.now() / 1000));

await (
await contract.addHealthRecord(
MEDICAL_CATEGORIES.indexOf(dataType),
timestamp,
encrypted.encryptedData,
encrypted.proof
)
).wait();

notify?.(" Record added");
loadRecords();
} catch (err: any) {
notify?.(` Error: ${err.message}`);
}
}

return { records, addHealthRecord, decryptRecord };
}