const base = require('path').join(__dirname,'base')
module.exports = class extends base{


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

    setBaseActions(){
        const actions = [
            [
                'on',function(triggername,triggercb){
                    this.registerCallBack(triggername,triggercb)
                    this.registerTrigger(triggername,this.getCallBack(triggername))
                }
            ]
        ]
        actions.forEach(
            ([name,callback])=>{
                this.actions[name] = callback
            }
        )
    }

    constructor(){
        super()
        this.triggers = {}
        this.callbacks= {}
        this.actions={}
        this.setBaseActions()
        console.log('we can do ...',this.actions)
    
    }


}