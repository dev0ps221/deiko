module.exports = class{
    //Evts

    registerTrigger(tn,cb){
        this.triggers[tn] = {
            name:tn,
            getCb:function(cb){
                return cb
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
        return this.callbacks.hasOwnProperty(tn)?this.callbacks[tn]:null
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
                'on',function(triggername,triggercb){
                    this.registerCallBack(triggername,triggercb)
                    this.registerTrigger(triggername,this.getCallBack(triggername))
                }
            ],[
                'trigger',function(triggername,...data){
                    if(this.getTrigger(triggername)) this.doTrigger(triggername,this.getTrigger(triggername),data)
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
        if(this.triggered.length){
            Object.keys(this.triggered).forEach(
                tn=>{

                    this.triggered[tn].trigger(...this.triggered[tn].data)

                }
            )
            this.triggered = {}
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