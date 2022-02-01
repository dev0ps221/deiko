const path = require('path')
const actualpath = path.join(__dirname)
const rootpath = path.join(actualpath,'..','..')
const objectspath = path.join(actualpath,'objects')
const base = require(path.join(objectspath,'base'))
module.exports = class extends base{

    setManagers(){
        this.mans = {
            
        }
    }

    setObjects(){

        this.objs = {
            vchat : require(path.join(objectspath,'vchat'))
            ,vuser : require(path.join(objectspath,'vchatuser'))
            ,webserver : require(path.join(objectspath,'webserver'))
            ,clisocket : require(path.join(objectspath,'clisocket'))
            ,DeeBee : require(path.join(objectspath,'deebee'))
        }
        
    }

    constructor(){
        super()
        this.setManagers()
        this.setObjects()
        this.ready = 1
    }

}