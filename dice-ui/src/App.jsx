// App.jsx
import { useState, useEffect } from "react";
import { ethers } from "ethers";

const solidityAddress = import.meta.env.VITE_SOLIDITY_CONTRACT_ADDRESS;

const abi = [
  "function buyDice() payable",
  "function playDice(uint256 betAmount)",
  "function sellDice(uint256 diceAmount)",
  "function diceBalance(address account) view returns (uint256)"
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [diceBalance, setDiceBalance] = useState("0");
  const [nativeBalance, setNativeBalance] = useState("0");
  const [betAmount, setBetAmount] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isConnected && signer && contract) {
      loadBalances();
    }
  }, [isConnected, signer, contract]);

  async function connectWallet() {
    try {
      if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed!");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const prov = new ethers.BrowserProvider(window.ethereum);
      const signer = await prov.getSigner();
      const contract = new ethers.Contract(solidityAddress, abi, signer);

      console.log("Connected Wallet");

      setProvider(prov);
      setSigner(signer);
      setContract(contract);
      setIsConnected(true); // Bắt buộc để UI render

    } catch (err) {
      console.error("Connect Wallet Failed:", err);
      alert("Connect Wallet Failed: " + err.message);
    }
  }

  async function loadBalances() {
    try {
      const address = await signer.getAddress();
      const diceBal = await contract.diceBalance(address);
      const nativeBal = await provider.getBalance(address);

      setDiceBalance(ethers.formatUnits(diceBal, 18));
      setNativeBalance(ethers.formatUnits(nativeBal, 18));
    } catch (err) {
      console.error("Error loading balances:", err);
    }
  }

  async function buyDice() {
    try {
      const tx = await contract.buyDice({ value: ethers.parseEther("0.1") });
      await tx.wait();
      await loadBalances();
      alert("Buy Dice Success!");
    } catch (err) {
      alert("Buy Dice Failed: " + err.message);
    }
  }

  async function playDice() {
    try {
      if (betAmount === "" || isNaN(betAmount) || Number(betAmount) <= 0) {
        alert("Enter a valid bet amount.");
        return;
      }

      const tx = await contract.playDice(ethers.parseUnits(betAmount, 18));
      await tx.wait();
      await loadBalances();
      alert("Play Dice Success!");
    } catch (err) {
      alert("Play Dice Failed: " + err.message);
    }
  }

  async function sellDice() {
    try {
      const tx = await contract.sellDice(ethers.parseUnits(diceBalance, 18));
      await tx.wait();
      await loadBalances();
      alert("Sell Dice Success!");
    } catch (err) {
      alert("Sell Dice Failed: " + err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🎲 Dice Game UI</h1>
      {!isConnected ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <div>
          <p>Native Balance: {nativeBalance} ETH</p>
          <p>DICE Balance: {diceBalance} DICE</p>

          <button onClick={buyDice}>Buy Dice (0.1 ETH)</button>

          <div style={{ marginTop: 20 }}>
            <input
              type="text"
              placeholder="Enter bet amount"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
            />
            <button onClick={playDice}>Play Dice</button>
          </div>

          <div style={{ marginTop: 20 }}>
            <button onClick={sellDice}>Sell All Dice</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
