const path = require('path')
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


    on(ev,cb){

        this.evt.actions.on(
            ev,cb
        )

    }

    trigger(ev,...data){

        this.evt.actions.trigger(
            ev,...data
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

    constructor(data=null){
        this.clearData()
        this.evt=new (require(path.join(__dirname,'events')))
        if(data)this.assigndata(data)
    }

}