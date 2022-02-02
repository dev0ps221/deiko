const base = require(require('path').join(__dirname,'base'))
module.exports = class extends base{
    // vChat


    assignData(data,cb=null){
        this.id = data.id
        this.data = data
        this.conversationid = data.id
        this.members = []
        if(cb)cb()
    }

    setMembers(cb){
        this.members = []
        this.deebee.getConversationMembers(
            (e,members)=>{
                console.log('jarnga fii deh')
                if(e){
                    console.log(e)
                    if(cb)cb()
                }else{
                    let ms = []
                    if(members && members.length){
                        members.forEach(
                            (member,idx)=>{

                                this.deebee.getMember(
                                    member.id_user,(er,user)=>{
                                        if(er){
                                            console.log(er)
                                        }else{
                                            if(user && user.length){
                                                ms.push(user)
                                            }
                                        }
                                        if(idx+1==members.length){
                                            this.members = ms 
                                            if(cb)cb()
                                        }
                                    }
                                )

                            }
                        )
                    }else{
                        if(cb)cb()
                    }
                }
            }
        )


        if(cb)cb()
    }

    getMembers(){
        return this.members
    }

    get(){
        const {name,members,id} = this
        return {
            name,members,id
        }
    }

    setDeeBeeActions(){
        const conversationid = this.conversationid
        this.deebee._____registerAction(
            'getConversationMembers',
            function(cb){
                const req = this.__selectFrom(
                    'conversation_members',['*'],[['id_conversation'],[conversationid]]
                )
                this.db.query(
                    req,cb
                )
            }
        )


        this.deebee._____registerAction(
            'getMember',
            function(id,cb){
                const req = this.__selectFrom(
                    'users',['id','name'],[['id'],[id]]
                )
                this.db.query(
                    req,cb
                )
            }
        )

    }


    constructor(data){
        super(data)
        this.setDeeBeeActions()
        this.assignData(
            data,
            ()=>{
                this.setDeeBeeActions()
                
                this.setMembers(
                    ()=>{
                        this.ready = 1
                    }
                )
            }
        )
    }

}