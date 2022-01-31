module.exports = class{
    //Evts

    registerTrigger(tn,cb){
        let callback = cb
        this.triggers[tn] = {
            name:tn,
            getCb:()=>{
                return callback
            }
        }
    }

    forgetTrigger(tn){
        if(this.triggers.hasOwnProperty(tn)) delete(this.triggers[tn])
    }

    registerCallBack(tn,cb){
        this.callbacks[tn] = cb
    }

    forgetCallBack(tn){
        if(this.callbacks.hasOwnProperty(tn)) delete(this.callbacks[tn])
    }

    removeAction(an){
        if(this.actions.hasOwnProperty(an)) delete(this.actions[an])
    }

    addAction(an,af){
        this.actions[an] = af
    }

    getCallBack(tn){
        return this.callbacks.hasOwnProperty(tn)?this.callbacks[tn]:null
    }

    getTrigger(tn){
        return this.triggers.hasOwnProperty(tn)?this.triggers[tn]:null
    }


    doTrigger(tn,trigger,data){
        this.triggered[tn]={trigger,data}
    }

    undoTrigger(tn){
        if(this.getTrigger(tn)) delete(this.getTrigger(tn))
    }

    setBaseActions(){
        const actions = [
            [
                'on',(triggername,triggercb)=>{
                    this.registerCallBack(triggername,triggercb)
                    this.registerTrigger(triggername,this.getCallBack(triggername))
                }
            ],[
                'trigger',(triggername,...data)=>{

                    
                    if(this.getTrigger(triggername)){
                        this.doTrigger(triggername,this.getTrigger(triggername).getCb(),data)
                    }else{
                        let interv = setInterval(
                            ()=>{
                                if(this.getTrigger(triggername)){
                                    this.doTrigger(triggername,this.getTrigger(triggername).getCb(),data)
                                    clearInterval(interv)
                                }
                            }
                        )
                    }
                    
                }
            ]
        ]
        actions.forEach(
            ([name,callback])=>{
                this.actions[name] = callback
            }
        )
    }

    eventLoop(){
        
        if(Object.keys(this.triggers).length){
            Object.keys(this.triggers).forEach(
                tn=>{
                    if(this.triggered.hasOwnProperty(tn)){
                        this.triggered[tn].trigger(...this.triggered[tn].data)
                        delete(this.triggered[tn])
                    }
                }
            )
        }

    }


    loop(){

        this.evtsInterval = setInterval(()=>{this.eventLoop()},1500)

    }

    endloop(){


        this.clearInterval(this.evtsInterval)


    }

    constructor(){

        this.triggers = {}
        this.triggered={}
        this.callbacks= {}
        this.actions={}
        this.setBaseActions()
        this.loop()

    }


}