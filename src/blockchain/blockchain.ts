import { BlockChainStorage } from "./blockchain_storage";
import { Block } from "./block";
import { Vote } from "./vote";

const SHA256 = require("crypto-js/sha256");


const MAX_TRANSACTIONS_IN_BLOCK=3;//1000


export class BlockChain<T>{
    chain:BlockChainStorage<T>
    lastBlock:Block<T>
    pendingTransactions:Array<T>
    constructor(){
        this.pendingTransactions=[];
        this.chain= new BlockChainStorage();
        this.lastBlock=this.chain.getLatestBlock();
        
        if(!this.lastBlock)
            this.createGenesis();
    }
    addTransaction(transaction:T){
        this.pendingTransactions.push(transaction);
        if(this.pendingTransactions.length>=MAX_TRANSACTIONS_IN_BLOCK){
            this.addBlock();
            this.pendingTransactions=[];
        }
    }
    private addBlock(){
        var block=new Block(this.lastBlock.index+1,(new Date()).getTime(),this.calculateHash(this.lastBlock),this.pendingTransactions);
        this.prove(block);
        this.chain.saveBlock(block);
        this.lastBlock=block;
    }
    prove(block:Block<T>){
        while(true){
            if(this.calculateHash(block).substr(0,1)!=="0"){
                block.nonce++;
            }else{
                return;
            }
        }
    }
    createGenesis(){
        var g = new Block(0,(new Date()).getTime(),"genesis",[]);
        this.prove(g);
        this.chain.saveBlock(g);
        this.lastBlock=g;
    }
    calculateHash(block):string{
        return SHA256(JSON.stringify(block)).toString();
    }

    
}


