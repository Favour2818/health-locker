import { useState } from "react";
import { motion } from "framer-motion";
import useHealthLocker from "../hooks/useHealthLocker";
import useFhevmSetup from "../hooks/useFhevmSetup";
import { MEDICAL_CATEGORIES } from "../utils/categories";
import { useChainId } from "wagmi";
import { useNavigate } from "react-router-dom";
import ConnectWalletButton from "../components/ConnectWalletButton";


export default function Dashboard() {
const chainId = useChainId();
const navigate = useNavigate();

const { isInitialized, isInitializing } = useFhevmSetup();
const { records, addHealthRecord, decryptRecord } = useHealthLocker();

const [dataType, setDataType] = useState("");
const [value, setValue] = useState("");
const [message, setMessage] = useState<string | null>(null);
const [isAdding, setIsAdding] = useState(false);
const [decryptingIndex, setDecryptingIndex] = useState<number | null>(null);
const [isDecrypted, setIsDecrypted] = useState(false);

const showMessage = (msg: string) => setMessage(msg);

if (chainId !== 11155111) return <div className="warning-box">⚠ Switch to Sepolia</div>;

return (
<> 
{/* 🔹 Top Right Connect Wallet Button */}
      <div className="wallet-btn-container">
        <ConnectWalletButton />
      </div>
<div className="page dashboard-page">
<motion.header className="page-header" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
<h1>Health Data Locker</h1>
<p className="sub">Encrypted on-chain medical history</p>
</motion.header>

{message && <motion.div className="alert-box">{message}</motion.div>}
{!isInitialized && <div className="warning-box">⏳ Initializing privacy engine…</div>}

<section className="dashboard-grid">
{/* Add Record */}
<motion.div className="card">
<h3>Add Health Record</h3>
<select className="input" value={dataType} onChange={(e) => setDataType(e.target.value)}>
<option value="">Select Type</option>
{MEDICAL_CATEGORIES.map((c, i) => <option key={i}>{c}</option>)}
</select>

<input className="input"  placeholder="Value" value={value} onChange={(e) => setValue(e.target.value)} />

<motion.button
className="btn"
disabled={isAdding}
onClick={async () => {
if (!dataType || !value) return showMessage("Fill all inputs");
setIsAdding(true);
await addHealthRecord(dataType, +value, showMessage);
setIsAdding(false);
setDataType("");
setValue("");
setIsDecrypted(false); // fresh encrypted data
}}
>
{isAdding ? "Saving…" : "Add Record"}
</motion.button>
</motion.div>



{/* Decrypt All & Navigate */}
<motion.div className="card">
<h3>Actions</h3>

<motion.button
className="btn"
disabled={decryptingIndex !== null}
onClick={async () => {
setDecryptingIndex(-1);
try {
for (const rec of records) {
if (rec.value === null) await decryptRecord(rec.index, showMessage);
}
setIsDecrypted(true);
showMessage("🔓 Records decrypted successfully");
} catch {
showMessage("❌ Decryption cancelled or failed");
}
setDecryptingIndex(null);
}}
>
{decryptingIndex === -1 ? "Decrypting…" : "🔓 Decrypt Records"}
</motion.button>


</motion.div>
</section>
</div>

<div className="page dashboard-page">
<motion.header className="page-header">
<h1>Your Medical Records</h1>
</motion.header>

<table className="health-table">
<thead>
<tr>
<th>Type</th>
<th>Value</th>
<th>Date</th>
</tr>
</thead>
<tbody>
  {records.map((rec) => (
    <tr key={rec.index}>
      <td>{rec.dataType}</td>
      <td>{rec.value !== null && rec.value !== undefined ? rec.value : "Encrypted"}</td>
      <td>{rec.timestamp}</td>
    </tr>
  ))}
</tbody>
</table>

<motion.button className="btn" onClick={() => navigate("/dashboard")} style={{ marginTop: 20 }}>
🔐 Add New Records
</motion.button>
</div>

</>
);
}