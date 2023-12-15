import React from 'react';
import vickreyAuction from '../utils/vickereyAuction.js';
import web3 from '../utils/web3val.js';

const Withdraw = () => {
    const handleWithdraw = async () => {
        const accounts = await web3.eth.getAccounts();
        await vickreyAuction.methods.withdraw().send({ from: accounts[0] });
    };

    return (
        <button onClick={handleWithdraw}>Withdraw Funds</button>
    );
};

export default Withdraw;
