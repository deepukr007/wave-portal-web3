import React, { useEffect , useState} from "react";
import './App.css';
import { ethers } from "ethers";
import abi from "./utils/Waveportal.json"

function App() {
  
  const contractAddress = "0x74867D9944AD9cDb7879e17a8438B0bd11BF7eb9";
  const [currentAccount, setCurrentAccount] = useState("");
  const contractABI = abi.abi;
  const [allWaves, setAllWaves] = useState([]);

  
  
  

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

  const wave = async (message) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        let yourWaves = await wavePortalContract.getWavesBySender();
        console.log("You have sent me %d waves" , yourWaves.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  } 

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
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
          getAllWaves()
        } else {
          console.log("No authorized account found")
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkIfWalletIsConnected();
  }, []);
   
  return (
    <div className="App">
      <header className="App-header">
      👋 Hey there!
      </header>
      <div className="tagLine">
         I am Deepu and I love to build stuff | Muley | 📚Masters Student @University of Freiburg 
      </div>
      <div className="inputDiv">
        <textarea className="input" type="text" id="message"></textarea>
      </div>
      <div className="waveButton">
         <button onClick={()=>{wave(document.getElementById("message").value)}}>Wave at me </button>
      </div>
      {!currentAccount && (
        <div className="waveButton">
          <button  onClick={connectWallet}>
            Connect Wallet
          </button>
          </div>
        )}
          {allWaves.map((wave, index) => {
          return (
            <div key={index} className="listDiv">
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
    </div>
  );
}

export default App;
