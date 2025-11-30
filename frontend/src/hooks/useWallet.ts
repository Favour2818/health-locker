import { useAccount } from "wagmi";

export default function useWallet() {
  const { address, isConnected } = useAccount();
  return { address, isConnected };
}