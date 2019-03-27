const SHA256 = require('crypto-js/sha256')

class Block{
      constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
      }

      calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
      }
      // here we are trying to implement POW and add 2 zeros to the begining of the hash
      mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
          this.nonce++;
          this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash)
      }
}


class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 10;
  }
  // genesis is the first block in the blockchain and added manually
  createGenesisBlock(){
    return new Block(0, "01/01/2017","Genesis block", "0");
  }

  getLatestBlock(){
    return  this.chain[this.chain.length - 1];
  }
  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
  // this checks wether the chains created are valid and locked together correctly
  isChainValid(){
    for(let i = 1;i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      // here we are recalculating the hash and validating wether it is the correct chain
      if (currentBlock.hash != currentBlock.calculateHash()){
        return false;
      }
      // if our block points to the correct previous block
      if(currentBlock.previousHash !== previousBlock.hash){
        return false;
      }
    }
    return true;
  }
}

let valiCoin = new Blockchain();

console.log('Mining block 1...');
valiCoin.addBlock(new Block (1, "10/07/2017", { amount: 4}));

console.log('Mining block 2...')
valiCoin.addBlock(new Block (2, "12/07/2017", { amount: 10}));
