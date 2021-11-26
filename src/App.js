import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import abi from "./utils/Waveportal.json"

function App() {

  const contractAddress = "0x5C09796C76C82a4156D5933EfbcA5BB3115332F0";
  const [currentAccount, setCurrentAccount] = useState("");
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const getwavePortalContractObj = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        return wavePortalContract;
      }

      else {
        console.log("Ethereum object doesn't exist!");
      }

    }
    catch (error) {
      console.log(error)
    }

  }

  const [wavePortalContract , setwavePortalContract] = useState({});
  const [loaded , setLoaded] = useState(false);
  const [totalWaves , setTotalwaves] = useState(0);
  const [senderWaves , setSenderWaves] = useState(0);

  
  const wave = async () => {
    const waveTxn = await wavePortalContract.wave();
    console.log("Mining...", waveTxn.hash);
    await waveTxn.wait();
    console.log("Mined -- ", waveTxn.hash);
    alert("Succesfully sent a wave");
    getTotalWaves();
    getSenderWaves();

  }

  const getTotalWaves = async () => {
    let count = await wavePortalContract.getTotalWaves();
    console.log("Retrieved total wave count...", count.toNumber());
    setTotalwaves(count.toNumber())
  }

  const getSenderWaves = async () => {
    let yourWaves = await wavePortalContract.getWavesBySender();
    setSenderWaves(yourWaves.toNumber())
    console.log(`Out of {getTotalWaves()} waves , You have sent me ${yourWaves.toNumber()} waves`);
    alert(`Out of ${totalWaves} waves , You have sent me ${senderWaves} waves`);
  }


 useEffect (() => {
  
     checkIfWalletIsConnected();
     getwavePortalContractObj().then((result)=> { setwavePortalContract(result)});
     getTotalWaves();
     getSenderWaves();
     setLoaded(true);

  }, []);

return (
  <div>
  {loaded && (
  <div className="App">
    <header className="App-header">
      👋 Hey there!
    </header>
    <div className="tagLine">
      I am Deepu and I love to build stuff | Muley | 📚Masters Student @University of Freiburg
    </div>
    <div className="waveButton">
      <button onClick={wave}>Wave at me </button>
    </div>
    {!currentAccount && (
      <div className="waveButton">
        <button onClick={connectWallet}>
          Connect Wallet
        </button>
      </div>
    )}
      <div>
        {`Totally I got ${totalWaves} waves`}
      </div>

      <div>
        {`You have sent me  ${senderWaves} waves`}
      </div>
  </div>
  )}
 </div>
);
}


export default App;
