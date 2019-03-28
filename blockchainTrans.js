const SHA256 = require('crypto-js/sha256')

class Transaction{
  constructor(fromAddress,toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}
class Block{
      constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
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
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }
  // genesis is the first block in the blockchain and added manually
  createGenesisBlock(){
    return new Block("01/01/2017","Genesis block", "0");
  }

  getLatestBlock(){
    return  this.chain[this.chain.length - 1];
  }
  minePendingTransacrions(miningRewardAddress){
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null,miningRewardAddress, this.miningReward)
    ];
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address){
    let balance = 0;

    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress === address){
          balance -= trans.amount;
        }

        if(trans.toAddress === address){
          balance += trans.amount;
        }
      }
    }
    return balance;
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

let atroxCoin = new Blockchain();
atroxCoin.createTransaction(new Transaction('address1', 'address2',100));
atroxCoin.createTransaction(new Transaction('address2', 'address1',50));

console.log('\n Starting the miner...');
atroxCoin.minePendingTransacrions('Vali');

console.log('\nBalance of Vali is ', atroxCoin.getBalanceOfAddress('Vali'))
