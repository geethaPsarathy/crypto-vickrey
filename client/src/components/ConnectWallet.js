// src/components/ConnectWallet.js

import React, { useState } from 'react';

const ConnectWallet = ({ onConnect }) => {
    const [account, setAccount] = useState('');

    const connectWalletHandler = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            onConnect(accounts[0]);
        } else {
            alert('Please install MetaMask!');
        }
    };

    return (
        <div>
            <button onClick={connectWalletHandler}>Connect Wallet</button>
            {account && <p>Connected Account: {account}</p>}
        </div>
    );
};

export default ConnectWallet;
