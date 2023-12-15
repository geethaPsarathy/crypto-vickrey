import Web3 from 'web3';

let web3val;


 
if (window.ethereum) {
    web3val = new Web3(window.ethereum);
    window.ethereum.enable().catch(error => {
        console.error("User denied account access");
    });
} else if (window.web3) {
    web3val = new Web3(window.web3.currentProvider);
} else {
    web3val = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

export default web3val;
