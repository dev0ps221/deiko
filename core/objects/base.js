module.exports = class {


    clearData(){
        this.data = {}
    }

    assigndata(data){
        Object.keys(data).forEach(
            prop=>{
                this.data[prop] = data[prop]
            }
        )
    }

    constructor(){
        this.clearData()
    }

}