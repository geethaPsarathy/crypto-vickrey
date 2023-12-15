// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Minty is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping from token ID to token URI
    mapping(uint256 => string) private _tokenURIs;

    // Base URI
    string private _baseURIextended;

    constructor() ERC721("GeToken", "GTK") {
        _setBaseURI("ipfs://");
    }

    function _setBaseURI(string memory baseURI_) internal virtual {
        _baseURIextended = baseURI_;
    }

    // Override baseURI to return the base URI set above
    function _baseURI() internal view override returns (string memory) {
        return _baseURIextended;
    }

    // Function to mint a new NFT
    function mintToken(address owner, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();
        _safeMint(owner, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }

    // Set token URI (internal function, called in mintToken)
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }

//    // Function to retrieve the token URI
//     function tokenURI(uint256 tokenId) public view override returns (string memory) {
//     require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
//     return _tokenURIs[tokenId];
// }

    // Return the base URI for the token
    function baseTokenURI() public view returns (string memory) {
        return _baseURI();
    }
}
