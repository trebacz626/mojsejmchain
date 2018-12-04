export class Vote{
    pesel:string
    cadency:number
    lawGovId:number
    status:number//-1,0,1
    constructor(pesel:string,cadency:number,lawGovId:number,status:number){
        this.pesel=pesel;
        this.cadency=cadency;
        this.lawGovId=lawGovId;
        this.status=status;

	

    }
}