import * as kue from "kue";
import { BlockChain } from "./blockchain/blockchain";
import { Vote } from "./blockchain/vote";

export class BlockChainApp{
    queue:kue.Queue
    blockchain:BlockChain<Vote>
    constructor(){

    }
    start(){
        this.blockchain=new BlockChain();
        this.queue= kue.createQueue();
        this.queue.process("addVote",async (job:kue.Job,done:kue.DoneCallback)=>{
            console.log("processing"+JSON.stringify(job.data));
            try{
                this.blockchain.addTransaction(job.data);
                done(null,true);
            }catch(err){
                return done(err);
            }
        });
        this.queue.process("getPartOfChain",async(job:kue.Job,done:kue.DoneCallback)=>{
            try{
                var chain = this.blockchain.chain.getPartNr(job.data.index);
                done(null,chain);
            }catch(err){
                done(err);
            }
        })
        
    }
    test(){
        this.queue.process("test",async (job:kue.Job,done:kue.DoneCallback)=>{
            console.log("testing"+JSON.stringify(job.data));
            done(null);
        });
        this.queue.create("test",{message:"complete"});
    }
}
console.log("app");

var app = new BlockChainApp();
app.start();
console.log("starteeeed");

