import React, { useState } from 'react';
import vickreyAuction from '../utils/vickereyAuction.js';
import web3 from '../utils/web3val.js';

const RevealBid = ({ auctionId }) => {
    const [amount, setAmount] = useState('');
    const [secret, setSecret] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        await vickreyAuction.methods.revealBid(auctionId, web3.utils.toWei(amount, 'ether'), secret).send({ from: accounts[0] });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Bid Amount (ETH)" />
            <input type="text" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Secret Phrase" />
            <button type="submit">Reveal Bid</button>
        </form>
    );
};

export default RevealBid;
