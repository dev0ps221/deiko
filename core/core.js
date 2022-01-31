const path = require('path')
const actualpath = path.join(__dirname)
const rootpath = path.join(actualpath,'..')
const objectspath = path.join(actualpath,'objects')
const viewspath = path.join(rootpath,'views')
const assetspath = path.join(rootpath,'assets')
const actualfile = path.join(actualpath,__filename)
const actualfilepath = __filename
const objects = require(path.join(actualpath,'objects.js'))
const base = require(path.join(objectspath,'base'))
module.exports = class extends base{
    //Core


    setManagers(){
        this.managers = new objects()
        this.isReady()
    }

    constructor(){
        super()
        this.setManagers()
    }


}