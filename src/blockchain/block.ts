export class Block<T>{
    index:number;
    timestamp:number;
    transactions:Array<T>;
    nonce:number;
    previousHash:string;
    constructor(index:number,timestamp:number,previousHash:string,transactions:Array<T>){
        this.index=index;
        this.timestamp=timestamp;
        this.previousHash=previousHash;
        this.transactions=transactions;
        this.nonce=0;
    }
}