import React, { useState, useEffect } from 'react';
import ConnectWallet from './components/ConnectWallet.js';
import CreateAuction from './components/CreateAuction.js';
import ListAuctions from './components/ListAuctions.js';
import PlaceBid from './components/PlaceBid.js';
import AuctionDetails from './components/AuctionDetails.js';
import vickreyAuction from './utils/vickereyAuction.js';
import EndAuction from './components/EndAuction.js';
import RevealBid from './components/RevealBid.js';
import Withdraw from './components/Withdraw.js';
import web3val from './utils/web3val.js';


function App() {
    const [selectedAuctionId, setSelectedAuctionId] = useState(0);
    const [auctions, setAuctions] = useState([]);
    const [account, setAccount] = useState(null);

    const handleConnectWallet = (account) => {
        setAccount(account);
    };

    // const fetchAuctions = async () => {
    //     // Assuming you have a method in your contract to get the total number of auctions
    //     // const count = await vickreyAuction.methods.getAuctionList().call();
    //     // // console.log(count);
    //     // const loadedAuctions = [];
    //     // for (let i = 0; i < count; i++) {
    //     //     const auction = await vickreyAuction.methods.getAuctionByTokenId("0xbd0482ee7895f3ddb4318fed081a76b6cd911577i" , 1).call();
    //     //     loadedAuctions.push(auction);
    //     // }

    //     const auction = await vickreyAuction.methods.getAuctionByTokenId("bd0482ee7895f3ddb4318fed081a76b6cd911577i" , 1).call();
    //     console.log('cjed' , auction)
    //     setAuctions(auction);
    // };


    const fetchAuctions = async () => {
        try {
            // Correct the Ethereum address format
            console.log('fetcgh')
            const auction = await vickreyAuction.methods.getAuctionDetails(0).call();
            console.log('Fetched Auction: ', auction);

            const bidAmount = web3val.utils.toWei("10", "ether"); // Your bid amount in Ether
            const secret = "chakchak"; // Your secret
            const bidHash = web3val.utils.soliditySha3({type: 'uint256', value: bidAmount}, {type: 'string', value: secret});
            console.log(bidHash);
            
            if(auction){
                setSelectedAuctionId(0);
            }
            setAuctions([auction]);
        } catch (error) {
            console.error("Error fetching auctions:", error);
        }
    };

    const handleBidPlaced = () => {
        // fetchAuctions(); // Refresh the list of auctions when a new bid is placed
    };

    useEffect(() => {
        if(account){
            fetchAuctions();
        }
    }, [account]);

    return (
        <div>
            <h1>Vickrey Auction</h1>
            <ConnectWallet onConnect={handleConnectWallet} />
            {account && <CreateAuction/>}
            {auctions.length > 0 && <ListAuctions auctions={auctions} onSelectAuction={setSelectedAuctionId} />}
            {selectedAuctionId && (
                <>
                    <PlaceBid auctionId={selectedAuctionId} onBidPlaced={handleBidPlaced} />
                    {/* <AuctionDetails auctionId={selectedAuctionId} /> */}
                    <RevealBid auctionId={selectedAuctionId} />
                    <EndAuction auctionId={selectedAuctionId} />
                </>
            )}

            {/* <Withdraw /> */}
        </div>
    );
}

export default App;
