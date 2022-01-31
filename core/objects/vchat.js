const base = require(require('path').join(__dirname,'base'))
module.exports = class extends base{
    // vChat


    assignData(data){
        this.data = data
    }


    constructor(data){
        super()
        this.assignData()
    }

}