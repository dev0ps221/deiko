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

    initiateDeeBee(){
        
        const {MSQP,MSQH,MSQD,MSQU} = process.env
        this.deebee   = new (this.getObject('DeeBee'))({user:MSQU,host:MSQH,password:MSQP,database:MSQD}) 
        this.deebee._setUsersTable('users')
        this.deebee._setUsersLogField('name')
        this.deebee._setUsersPasswField()
        this.deebee._____registerAction(
            '___register',(
                function(username,password,cb){
                    const req = this.__insertINTO(this._getUsersTable(),[this._getUsersLogField(),this._getUsersPasswField()],[`'${username}'`,`password('${password}')`])
                    this.db.query(
                        req,cb
                    )
                }
            )
        )

    }


    setManagers(){
        this.managers = new objects()
        this.initiateDeeBee()    
        this.managers.whenReady(
            ()=>{
                this.ready = 1
            }
        )
    }

    getObject(name){
        return this.managers.objs.hasOwnProperty(name) ? this.managers.objs[name] : null
    }

    constructor(){
        super()
        this.setManagers()
    }








}