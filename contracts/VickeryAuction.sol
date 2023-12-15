// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VickreyAuction is IERC721Receiver, ReentrancyGuard {
    using ECDSA for bytes32;

    struct Auction {
        address seller;
        uint256 minBid;
        uint256 auctionEndTime;
        uint256 revealEndTime;
        bool ended;
        IERC721 nft;
        uint256 tokenId;
        address highestBidder;
        uint256 secondHighestBid;
        mapping(address => bytes32) bids;
        
    }

     uint256 public nextAuctionId;
    mapping(uint256 => Auction) public auctions;
    // Declare the auctionIdByToken mapping
    mapping(address => mapping(uint256 => uint256)) public  auctionIdByToken;


    event AuctionCreated(uint256 indexed auctionId, address indexed seller, uint256 tokenId);
    event BidSubmitted(uint256 indexed auctionId, address indexed bidder);
    event BidRevealed(uint256 indexed auctionId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed auctionId, address winner, uint256 amount);

    // Create a new auction
    function createAuction(
        address nftAddress,
        uint256 tokenId,
        uint256 minBid,
        uint256 auctionDuration,
        uint256 revealDuration
    ) external {
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the NFT owner");
        require(nft.isApprovedForAll(msg.sender, address(this)), "Contract must be approved to transfer NFT");

        uint256 auctionId = nextAuctionId++;
        Auction storage auction = auctions[auctionId];
        auction.seller = msg.sender;
        auction.minBid = minBid;
        auction.auctionEndTime = block.timestamp + auctionDuration;
        auction.revealEndTime = auction.auctionEndTime + revealDuration;
        auction.nft = nft;
        auction.tokenId = tokenId;

         // Update the auctionIdByToken mapping
        auctionIdByToken[nftAddress][tokenId] = auctionId;

        emit AuctionCreated(auctionId, msg.sender, tokenId);
    }

    // Bid on an auction
    function submitBid(uint256 auctionId, bytes32 bid) external payable {
        Auction storage auction = auctions[auctionId];
        require(block.timestamp < auction.auctionEndTime, "Auction bidding time has ended");

        auction.bids[msg.sender] = bid;
        emit BidSubmitted(auctionId, msg.sender);
    }

    // Reveal a bid
    function revealBid(
        uint256 auctionId,
        uint256 amount,
        bytes32 secret
    ) external nonReentrant {
        Auction storage auction = auctions[auctionId];
        require(block.timestamp > auction.auctionEndTime, "Auction bidding time has not ended");
        require(block.timestamp < auction.revealEndTime, "Reveal time has ended");

        bytes32 bid = keccak256(abi.encodePacked(amount, secret));
        require(auction.bids[msg.sender] == bid, "Incorrect bid reveal");

        if (amount > auction.minBid) {
            if (amount > auction.secondHighestBid) {
                if (auction.highestBidder != address(0)) {
                    payable(auction.highestBidder).transfer(auction.secondHighestBid);
                }
                auction.secondHighestBid = amount;
                auction.highestBidder = msg.sender;
            } else if (amount > auction.minBid && amount < auction.secondHighestBid) {
                auction.secondHighestBid = amount;
            }
        }

        emit BidRevealed(auctionId, msg.sender, amount);
    }

    // End the auction
    function endAuction(uint256 auctionId) external nonReentrant {
        Auction storage auction = auctions[auctionId];
        require(block.timestamp >= auction.revealEndTime, "Reveal time has not ended");
        require(!auction.ended, "Auction has already ended");
        require(auction.seller == msg.sender, "Only the seller can end the auction");

        auction.ended = true;
        if (auction.highestBidder != address(0)) {
            auction.nft.safeTransferFrom(address(this), auction.highestBidder, auction.tokenId);
            payable(auction.seller).transfer(auction.secondHighestBid);
        } else {
            // No valid bids, return NFT to seller
            auction.nft.safeTransferFrom(address(this), auction.seller, auction.tokenId);
        }

        emit AuctionEnded(auctionId, auction.highestBidder, auction.secondHighestBid);
    }

    // Implementing IERC721Receiver
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

     // Function to get auction by NFT address and token ID
    function getAuctionByTokenId(address nftAddress, uint256 tokenId) 
        external 
        view 
        returns (uint256)
    {
        return auctionIdByToken[nftAddress][tokenId];
    }

    // Function to get auction details
    function getAuctionDetails(uint256 auctionId) 
        external 
        view 
        returns (
            address seller,
            uint256 minBid,
            uint256 auctionEndTime,
            uint256 revealEndTime,
            bool ended,
            address nftAddress,
            uint256 tokenId,
            address highestBidder,
            uint256 secondHighestBid
        )
    {
        Auction storage auction = auctions[auctionId];
        return (
            auction.seller,
            auction.minBid,
            auction.auctionEndTime,
            auction.revealEndTime,
            auction.ended,
            address(auction.nft),
            auction.tokenId,
            auction.highestBidder,
            auction.secondHighestBid
        );
    }
}
