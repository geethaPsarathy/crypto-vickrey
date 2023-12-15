import React, { useEffect, useState } from 'react';
import vickreyAuction from '../utils/vickereyAuction.js';
import web3 from '../utils/web3val.js';
const AuctionDetails = ({ auctionId }) => {
    console.log(auctionId);
    const [auction, setAuction] = useState({});

    const fetchAuctionDetails = async () => {
        const auctionDetails = await vickreyAuction.methods.getAuctionByTokenId(1).call();
        setAuction(auctionDetails);
    };

    useEffect(() => {
        fetchAuctionDetails();
    }, [auctionId]);

    return (
        <div>
            <h3>Auction Details</h3>
            <p>NFT: {auction.nft}</p>
            <p>Minimum Price: {web3.utils.fromWei(auction.minPrice, 'ether')} ETH</p>
            {/* Display other relevant auction details */}
        </div>
    );
};

export default AuctionDetails;
