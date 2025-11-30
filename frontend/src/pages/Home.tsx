import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import ConnectWalletButton from "../components/ConnectWalletButton";

function Home() {
  return (

<> {/* 🔹 Top Right Connect Wallet Button */}
      <div className="wallet-btn-container">
        <ConnectWalletButton />
      </div>

<div className="home-landing">

     
      {/* Floating animated glow */}
      <div className="neon-orb orb1"></div>
      <div className="neon-orb orb2"></div>

      <motion.div
        className="home-panel"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
    

        <motion.h1
          className="home-title-main"
          animate={{
            textShadow: [
              "0px 0px 20px rgba(90,185,255,0.8)",
              "0px 0px 5px rgba(90,185,255,0.4)",
            ],
          }}
          transition={{ repeat: Infinity, duration: 1.8, repeatType: "reverse" }}
        >
          PRIVATE HEALTH<br /> DATA LOCKER
        </motion.h1>

        <p className="home-desc">
          Your encrypted medical data vault.<br />
          Secure, private, and powered by <span>Web3</span>.
        </p>

        <div className="futuristic-list">
          <p>🔒 End-to-End Encryption</p>
          <p>🩺 Secure Doctor Access</p>
          <p>📊 Fully Decentralized Storage</p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/dashboard" className="go-dashboard-btn">
            Go to Dashboard →
          </Link>
        </motion.div>
      </motion.div>
    </div>

</>
   
  );
}

export default Home;