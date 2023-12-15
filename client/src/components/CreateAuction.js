// src/components/CreateAuction.js

import React, { useState } from 'react';
import vickreyAuction from '../utils/vickereyAuction.js';
import web3 from '../utils/web3val.js';

const CreateAuction = () => {
    const [nftAddress, setNftAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [minBid, setMinBid] = useState('');
    const [auctionDuration, setAuctionDuration] = useState('');
    const [revealDuration, setRevealDuration] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Ensure web3 and the user's account are available
        if (!web3) {
            console.error('Web3 is not initialized');
            return;
        }
    
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            console.error('No accessible accounts');
            return;
        }
    
        // // Instance of your smart contract
        // const auctionContract = new web3.eth.Contract(
        //     YourAuctionContractABI, // Replace with your contract's ABI
        //     YourAuctionContractAddress // Replace with your contract's address
        // );
    
        // Convert minBid to Wei
        const minBidInWei = web3.utils.toWei(minBid, 'ether');
    
        try {
            // Call the createAuction function from your smart contract
            await vickreyAuction.methods.createAuction(
                nftAddress,
                tokenId,
                minBidInWei,
                auctionDuration,
                revealDuration
            ).send({ from: accounts[0] });
    
            // Optionally, you can handle the receipt or events here
    
            console.log('Auction created successfully');
    
            // Reset form or redirect user as needed
            // ...
    
        } catch (error) {
            console.error('Error creating auction:', error);
            // Handle errors, such as displaying a message to the user
        }
    };
    
    
    return (
        <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="nftAddress">NFT Address:</label>
            <input
                type="text"
                id="nftAddress"
                value={nftAddress}
                onChange={(e) => setNftAddress(e.target.value)}
                required
            />
        </div>
        <div>
            <label htmlFor="tokenId">Token ID:</label>
            <input
                type="number"
                id="tokenId"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                required
            />
        </div>
        <div>
            <label htmlFor="minBid">Minimum Bid (in Ether):</label>
            <input
                type="text"
                id="minBid"
                value={minBid}
                onChange={(e) => setMinBid(e.target.value)}
                required
            />
        </div>
        <div>
            <label htmlFor="auctionDuration">Auction Duration (in seconds):</label>
            <input
                type="number"
                id="auctionDuration"
                value={auctionDuration}
                onChange={(e) => setAuctionDuration(e.target.value)}
                required
            />
        </div>
        <div>
            <label htmlFor="revealDuration">Reveal Duration (in seconds):</label>
            <input
                type="number"
                id="revealDuration"
                value={revealDuration}
                onChange={(e) => setRevealDuration(e.target.value)}
                required
            />
        </div>
        <button type="submit">Create Auction</button>
    </form>
    );
};

export default CreateAuction;
