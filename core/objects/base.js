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
        if(data)this.assigndata(data)
    }

}