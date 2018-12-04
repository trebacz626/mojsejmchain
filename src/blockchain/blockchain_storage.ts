import { Block } from "./block";
import * as fs from "fs";

const MAX_BLOCKS_IN_FILE=3;
const DIRECTORY="./blockchainStorage/";

export class BlockChainStorage<T>{
    currentChain:Array<Block<T>>
    curIndex:number
    constructor(){
        this.curIndex=0;
        this.getLatestFile();
    }
    getLatestBlock(){
        if(this.currentChain.length)
            return this.currentChain[this.currentChain.length-1]
        else if(this.curIndex===0)
            return null;
        else{
            var chain = JSON.parse(fs.readFileSync(DIRECTORY+this.curIndex.toString()+".json","utf8"))
            return(chain[chain.length-1]);
        }
    }
    getLatestFile(){
        if(!fs.existsSync(DIRECTORY)){
            fs.mkdirSync(DIRECTORY);
        }
        var files = fs.readdirSync(DIRECTORY,"utf8");
        
        for(let i=0;i<files.length;i++){
            let id=Number(files[i].slice(0,files[i].length-5))
            if(id>this.curIndex)
                this.curIndex=id;
        }
        if(this.curIndex===0){
            this.writeFile(0,[]);
            this.currentChain=[];
        }else{
            this.currentChain=JSON.parse(fs.readFileSync(DIRECTORY+this.curIndex.toString()+".json","utf8"));
            if(this.currentChain.length===MAX_BLOCKS_IN_FILE)this.curIndex++;
            this.currentChain=[];
        }

    }
    saveBlock(block:Block<T>){
        this.currentChain.push(block);
        this.writeFile(this.curIndex,this.currentChain);
        if(this.currentChain.length===MAX_BLOCKS_IN_FILE){
            this.curIndex++;
            this.currentChain=[];
        }
    }
    writeFile(index:number,content:Object){
        fs.writeFileSync(DIRECTORY+index.toString()+".json",JSON.stringify(content),"utf8");
    }
    getPartNr(index:number){
        if(index>this.curIndex){
            throw new Error("Our blockchain isn't so long");
        }else if(index===this.curIndex){
            return this.currentChain;
        }else{
            return JSON.parse(fs.readFileSync(DIRECTORY+index.toString()+".json","utf8"));
        }
    }

}
