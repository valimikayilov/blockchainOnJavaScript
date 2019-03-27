const SHA256 = require('crypto-js/sha256')

class Block{
      constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();

      }

      calculateHash(){
        return SHA256(this.index + this.previouHash + this.timestammp + JSON.stringify(this.data)).toString();
      }
}

class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
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
    newBlock.hash = newBlock.calculateHash();
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
valiCoin.addBlock(new Block (1, "10/07/2017", { amount: 4}));
valiCoin.addBlock(new Block (2, "12/07/2017", { amount: 10}));

console.log('Is blockchain valid? ' + valiCoin.isChainValid());

// tampering with our blockchain to make it invalid
valiCoin.chain[1].data = {amount: 100};
valiCoin.chain[1].hash = valiCoin.chain[1].calculateHash();
// rechecking
console.log('Is blockchain valid? ' + valiCoin.isChainValid());

//try to edit other data to make the blockchain valid again
valiCoin.chain[2].previouHash = valiCoin.chain[1].hash;

console.log('Is blockchain valid? ' + valiCoin.isChainValid());
console.log(JSON.stringify(valiCoin, null, 4));
