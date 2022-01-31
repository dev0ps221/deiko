const path = require('path')
const actualpath = path.join(__dirname)
const rootpath = path.join(actualpath,'..','..')
const objectspath = path.join(actualpath)
const base = require(path.join(objectspath,'base'))
module.exports = class extends base{

    setManagers(){
        this.mans = {
            evs:require(path.join(actualpath,'events'))
        }
    }

    constructor(){
        super()
        this.setManagers()
    }
}