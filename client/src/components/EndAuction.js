import React from 'react';
import vickreyAuction from '../utils/vickereyAuction.js';
import web3 from '../utils/web3val.js';

const EndAuction = ({ auctionId }) => {
    const handleEndAuction = async () => {
        const accounts = await web3.eth.getAccounts();
        await vickreyAuction.methods.endAuction(auctionId).send({ from: accounts[0] });
    };

    return (
        <button onClick={handleEndAuction}>End Auction</button>
    );
};

export default EndAuction;
