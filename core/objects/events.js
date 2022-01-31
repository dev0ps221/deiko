const base = require('path').join(__dirname,'base')
module.exports = class extends base{


    registerCallBack(){

    }

    forgetCallBack(){
        
    }

    removeAction(){

    }

    addAction(){

    }

    setBaseActions(){
        
    }

    constructor(){
        super()
        this.triggers = {}
        this.callbacks= {}
        this.actions={}
        this.setBaseActions()
    
    
    }


}