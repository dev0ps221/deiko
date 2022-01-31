const path = require('path')
const { clearInterval } = require('timers')
module.exports = class {


    clearData(){
        this.data = {}
    }

    assigndata(data){
        Object.keys(data).forEach(
            prop=>{
                this[prop] = data[prop]
            }
        )
    }


    isReady(...data){


        this.trigger(
            'ready',...data
        )

    }

    when(ev,cb){

        this.evt.actions.on(
            ev,cb
        )

    }

    trigger(ev,...data){

        this.evt.actions.trigger(
            ev,...data
        )

    }

    whenReady(cb){
        this.when(
            'ready',cb
        )
    }

    getId(){
        return this.hasOwnProperty('id') ? this.id : null
    }

    getName(){
        return this.hasOwnProperty('name') ? this.name : null
    }

    getProp(prop){
        return this.hasOwnProperty(prop) ? this[prop] : null
    }

    checkReady(){
        if(this.ready){
            clearInterval(this.checkReadyInterval)
            this.isReady()
        }
    }

    constructor(data=null){
        this.clearData()
        this.checkReadyInterval = setInterval(()=>{this.checkReady()},500)
        this.evt=new (require(path.join(__dirname,'events')))
        if(data)this.assigndata(data)
    }

}