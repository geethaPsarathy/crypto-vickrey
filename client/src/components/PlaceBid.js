import React, { useState } from 'react';
import vickreyAuction from '../utils/vickereyAuction.js';
import web3 from '../utils/web3val.js';

const PlaceBid = ({ auctionId = 0, onBidPlaced }) => {
    const [bidAmount, setBidAmount] = useState('');
    const [secret, setSecret] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log('placebid');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setStatusMessage('Submitting your bid...');

        try {
            const accounts = await web3.eth.getAccounts();
            const hashedBid = web3.utils.soliditySha3({ type: 'uint256', value: web3.utils.toWei(bidAmount, 'ether') }, { type: 'string', value: secret });
            
            await vickreyAuction.methods.submitBid(auctionId, hashedBid).send({ from: accounts[0], value: web3.utils.toWei(bidAmount, 'ether') });
            setStatusMessage('Bid placed successfully!');
            onBidPlaced();
        } catch (error) {
            console.error('Error placing bid:', error);
            setStatusMessage('Error placing bid. Please try again.');
        }

        setIsSubmitting(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="number" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} placeholder="Bid Amount (ETH)" disabled={isSubmitting} />
                <input type="text" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Secret Phrase" disabled={isSubmitting} />
                <button type="submit" disabled={isSubmitting}>Place Bid</button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
};

export default PlaceBid;
