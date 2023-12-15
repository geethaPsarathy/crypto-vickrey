import React, { useEffect, useState } from 'react';
import vickreyAuction from '../utils/vickereyAuction.js';
import web3 from '../utils/web3val.js';
import './styles.css'

const ListAuctions = () => {
    const [auctions, setAuctions] = useState([]);

    const fetchAuctions = async () => {
        try {
            const auction = await vickreyAuction.methods.getAuctionDetails(1).call();
            setAuctions([auction]);
        } catch (error) {
            console.error("Error fetching auctions:", error);
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, []);

    // Helper function to convert timestamp to readable date
    const formatTimestamp = (timestamp) => {
        return new Date(Number(timestamp) * 1000).toLocaleString();
    };

    // Helper function to convert Wei to Ether
    const formatWeiToEther = (wei) => {
        return web3.utils.fromWei(wei.toString(), 'ether');
    };

    return (
        <div className="auction-list">
            {auctions.map((auction, index) => (
                <div className="auction-box" key={index}>
                    <p><strong>Auction ID:</strong> {index}</p>
                    <p><strong>NFT Address:</strong> {auction.nftAddress}</p>
                    <p><strong>Minimum Bid:</strong> {formatWeiToEther(auction.minBid)} ETH</p>
                    <p><strong>Second Highest Bid:</strong> {formatWeiToEther(auction.secondHighestBid)} ETH</p>
                    <p><strong>Auction End Time:</strong> {formatTimestamp(auction.auctionEndTime)}</p>
                    <p><strong>Reveal End Time:</strong> {formatTimestamp(auction.revealEndTime)}</p>
                    <p><strong>Ended:</strong> {auction.ended ? 'Yes' : 'No'}</p>
                    <p><strong>Seller:</strong> {auction.seller}</p>
                    <p><strong>Token ID:</strong> {auction.tokenId.toString()}</p>
                    <p><strong>Highest Bidder:</strong> {auction.highestBidder}</p>
                </div>
            ))}
        </div>
    );
};

export default ListAuctions;
